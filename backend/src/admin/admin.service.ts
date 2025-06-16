import { BadRequestException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Transaction } from 'src/core/entities/transaction.entity';
import { Account } from 'src/core/entities/account.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { DepositDto } from './accounts/dto/depositdto';
import { AppNotification, NotificationType } from 'src/core/entities/notification.entity';
@Injectable()
export class AdminService {
    
    constructor(
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
        @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
        @InjectRepository(AppNotification) private readonly notificationRepository: Repository<AppNotification>,
    ) {}

    async getAllTransactions() {
        const transactions = await this.transactionRepository.find({
            relations: ['account', 'account.branch', 'account.customer'],
        });

        if (!transactions) {
            return {
                status: 'error',
                message: 'No transactions found',
                data: [],
            };
        }

        return {
            status: 'success',
            data: transactions.map(transaction => ({
                id: transaction.id,
                amount: transaction.amount,
                type: transaction.type,
                currency: transaction.account.currencyCode,
                accountNumber: transaction.account.accountNumber,
                transactionDate: transaction.createdAt.toISOString().split('T')[0], // Format date to YYYY-MM-DD
                transactionDirection: transaction.direction,
                transactionGroupid: transaction.transactionGroupId,
                notes: transaction.notes,   
                branchName: transaction.account.branch.branchName,
                customerName: transaction.account.customer.fullName,
                
            })),
            message: 'Transactions retrieved successfully',
        };
    }

    async deposit(depositDto: DepositDto) {
        const { accountNumber, amount } = depositDto;

        if (!accountNumber || !amount || amount <= 0) {
            throw new BadRequestException('Invalid deposit details');
        }
        const account = await this.accountRepository.findOne({
            where: { accountNumber: accountNumber },
            relations: ['branch', 'customer'],
        });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        if (account.balance + amount > 1000000) { // Assuming a maximum balance limit
            throw new NotAcceptableException('Deposit exceeds maximum balance limit');
        }
        
        // Update account balance and save using accountRepository
        account.balance += amount;
        await this.accountRepository.save(account);

        const branch = await this.branchRepository.findOne({
            where: { branchName: account.branch.branchName },
        });
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }
        // Update branch total deposits
        branch.totalDeposits += amount;
        await this.branchRepository.save(branch);



        // Create a new transaction record
        const transaction = this.transactionRepository.create({
            account, 
            amount,
            type: 'deposit',
            direction: 'credit',
            createdAt: new Date(),
            notes: `Deposit of ${amount} to account ${accountNumber}`,
        });

        await this.transactionRepository.save(transaction);
        const notification = this.notificationRepository.create({
            customer: account.customer,
            createdAt: new Date(),
            message: `Deposit of ${amount} to your account ${accountNumber} was successful.`,
            type: NotificationType.TRANSACTION,
            isRead: false,
        });
        return {
            status: 'success',
            data: {
                transactionId: transaction.id,
                accountType: account.accountType,
                accountNumber: account.accountNumber,
                newBalance: account.balance,
                branchName: branch.branchName,
                transactionDate: transaction.createdAt.toISOString(),
            },
            message: 'Deposit successful',
        };
    }

}
