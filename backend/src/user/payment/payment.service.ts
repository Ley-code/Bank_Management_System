// src/payment/payment.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, Repository } from 'typeorm';
import { Payment } from 'src/core/entities/payment.entity';
import { Loan } from 'src/core/entities/loan.entity';
import { Account } from 'src/core/entities/account.entity';
import { Transaction } from 'src/core/entities/transaction.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppNotification, NotificationType } from 'src/core/entities/notification.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { create } from 'domain';


@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        @InjectRepository(Account)
        private accountRepo: Repository<Account>,
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
        @InjectRepository(AppNotification)
        private notificationRepository: Repository<AppNotification>,
    ) { }

    async confirmPayment(paymentId: string, accountId: string) {
        const payment = await this.paymentRepo.findOne({
            where: { id: paymentId },
            relations: ['loan', 'loan.account'],
        });

        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.isPaid) throw new BadRequestException('Payment already made');

        const account = await this.accountRepo.findOne({ where: { accountNumber: accountId } });
        if (!account) throw new NotFoundException('Account not found');

        if (account.balance < payment.amount)
            throw new BadRequestException('Insufficient account balance');

        account.balance -= payment.amount;
        account.balance = Math.round(account.balance)
        await this.accountRepo.save(account);

        payment.isPaid = true;
        payment.paidAt = new Date();
        await this.paymentRepo.save(payment);

        const transaction = this.transactionRepo.create({
            direction: 'Debit',
            amount: payment.amount,
            account: account,
            type: 'loan payment',
            notes: `Loan payment for loan ${payment.loan.id}`,
            createdAt: new Date(),
        });
        await this.transactionRepo.save(transaction);

        return {
            status: 'success',
            message: 'Payment confirmed and deducted from account.',
        };
    }

    async getLoanPayments(loanId: string){
        console.log('Fetching payments for loan ID:', loanId);
        console.log('-----------------------------------------------------------------')
        const payments = await this.paymentRepo.find({
            where: {
                loan: { id: loanId },
            },
            relations: ['loan', 'loan.account'],
        });

        if (!payments || payments.length === 0) {
            throw new NotFoundException('No payments found for this loan');
        }

        // Since all payments belong to the same loan, account, and customer, extract once
        const { account } = payments[0].loan;
        const { customer } = account;
        const accountNumber = account.accountNumber;
        const customerName = customer.fullName;

        return {
            status: 'success',
            loanId,
            accountNumber,
            customerName,
            data: payments.map((payment) => ({
                id: payment.id,
                amount: payment.amount,
                dueDate: payment.dueDate.toISOString().split('T')[0], // Format date to YYYY-MM-DD
                isPaid: payment.isPaid,
                isOverdue: payment.isOverdue,
                paidAt: payment.paidAt ? payment.paidAt.toISOString().split('T')[0] : null,
            })),
            message: 'Payments retrieved successfully',
        };
    }

    // === Cron job: Mark overdue payments daily at midnight ===
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async markOverduePayments() {
        const today = new Date();

        const overduePayments = await this.paymentRepo.find({
            where: {
                dueDate: LessThan(today),
                isPaid: false,
            },
            relations: ['loan', 'loan.account'],
        });

        for (const payment of overduePayments) {
            payment.isOverdue = true;
            await this.paymentRepo.save(payment);

            // 🔔 Optionally: trigger notification to user
            this.notifyUser(payment.loan.account.customer, 'Your loan payment is overdue!');
        }
    }

    // === Cron job: Remind users 3 days before due date ===
    @Cron(CronExpression.EVERY_2_HOURS)
    async remindUpcomingPayments() {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 31);

        const upcomingPayments = await this.paymentRepo.find({
            where: {
                dueDate: Between(today, threeDaysFromNow),
                isPaid: false,
            },
            relations: ['loan', 'loan.account'],
        });

        for (const payment of upcomingPayments) {
            this.notifyUser(
                payment.loan.account.customer,
                `Reminder: You have a loan payment of ${payment.amount} due on ${payment.dueDate.toDateString()}.`
            );
        }
    }
    private async notifyUser(customer: Customer, message: string) {
        const notification = this.notificationRepository.create({
            customer,
            type: NotificationType.LOAN_REMINDER,
            message,
            createdAt: new Date(),
            isRead: false
        });
        await this.notificationRepository.save(notification);
    }
}


