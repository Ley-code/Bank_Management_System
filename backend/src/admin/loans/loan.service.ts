import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/core/entities/loan.entity';
import { LoanRequest, LoanRequestStatus, LoanType } from 'src/core/entities/loanRequest.entity';
import { Repository } from 'typeorm';
import { AcceptLoanRequestDto } from './dto/acceptLoanRequestdto';
import { addMonths } from 'date-fns';
import { BusinessLogicService } from 'src/core/business/BusinessLogic';
import { RejectLoanRequestDto } from './dto/rejectLoanRequestdto';
import { Payment } from 'src/core/entities/payment.entity';

@Injectable()
export class LoanService {

    constructor(
        @InjectRepository(LoanRequest)
        private readonly loanRequestsRepository: Repository<LoanRequest>,
        @InjectRepository(Loan)
        private readonly loanRepository: Repository<Loan>,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly businessService: BusinessLogicService, 

    ) { }
    async acceptLoanRequest({ loanRequestId, loanDurationInMonths }: AcceptLoanRequestDto) {
        const loanRequest = await this.loanRequestsRepository.findOne({
            where: { id: loanRequestId },
            relations: ['account', 'account.customer'],
        });

        if (!loanRequest) {
            throw new NotFoundException('Loan request not found');
        }
        if (loanRequest.status !== LoanRequestStatus.PENDING) {
            throw new BadRequestException('Loan request is not in pending status. it is either accepted or rejected');
        }

        loanRequest.status = LoanRequestStatus.APPROVED;
        await this.loanRequestsRepository.save(loanRequest);

        const issuedAt = new Date();
        const dueDate = addMonths(issuedAt, loanDurationInMonths);

        const interestRate = 0.07;
        const annualRate = 7; 
        const monthlyPayment = this.businessService.calculateMonthlyPayment(loanRequest.amount, annualRate, loanDurationInMonths);
        const totalPayable = this.businessService.calculateTotalPayable(loanRequest.amount, interestRate);
        const loan = this.loanRepository.create({
            dueDate,
            issuedAt,
            loanDurationInMonths,
            totalPayable,
            monthlyPayment,
            account: loanRequest.account,
            loanRequest,
        });

        await this.loanRepository.save(loan);

        for (let i = 1; i <= loanDurationInMonths; i++) {
            const dueDate = addMonths(loan.issuedAt, i); 
            const payment = this.paymentRepository.create({
                loan,
                dueDate,
                amount: monthlyPayment,
                isPaid: false,
                isOverdue: false,
            });
            await this.paymentRepository.save(payment);
        }


        return {
            status: 'success',
            message: 'Loan request accepted successfully',
            data: {
                accountNumber: loanRequest.account.accountNumber,
                customerName: loanRequest.account.customer.fullName,
                amountApproved: loanRequest.amount,
                loanType: loanRequest.loanType,
                payments: loan.payments
            },
        };
    }
    async rejectLoanRequest(rejectLoanRequestdto: RejectLoanRequestDto) {
        const loanRequest = await this.loanRequestsRepository.findOne({
            where: { id: rejectLoanRequestdto.loanRequestId },
            relations: ['account', 'account.customer'],
        });
        if (!loanRequest) {
            throw new NotFoundException('Loan request not found');
        }
        loanRequest.status = LoanRequestStatus.REJECTED;
        await this.loanRequestsRepository.save(loanRequest);
        return {
            status: 'success',
            message: 'Loan request rejected successfully',
        };


    }
    async getAllLoanRequests() {
        const loanRequests = await this.loanRequestsRepository.find({
            relations: ['account']
        })

        if (loanRequests.length == 0) {
            return {
                status: 'success',
                message: 'No loan requests found',
                data: [],
            };
        }
        return {
            status: 'success',
            data: loanRequests.map((loanrequest) => ({
                lonRequestId: loanrequest.id,
                accountNumber: loanrequest.account.accountNumber,
                customerName: loanrequest.account.customer.fullName,
                branch: loanrequest.account.branch.branchName,
                amountRequested: loanrequest.amount,
                loanType: loanrequest.loanType,
                status: loanrequest.status
            })),
            message: 'Loan Request fetched successfully',

        }
    }
    async getAllLoans() {
        const loans = await this.loanRepository.find({
            relations: ['account', 'loanRequest'],
        });

        if (loans.length === 0) {
            return {
                status: 'success',
                message: 'No loans found',
                data: [],
            };
        }

        return {
            status: 'success',
            data: loans.map((loan) => ({
                loanId: loan.id,
                accountNumber: loan.account.accountNumber,
                customerName: loan.account.customer.fullName,
                amountApproved: loan.loanRequest.amount,
                loanType: loan.loanRequest.loanType,
                issuedAt: loan.issuedAt.toISOString(),
                dueDate: loan.dueDate.toISOString(),
                monthlyPayment: loan.monthlyPayment,
                totalPayable: loan.totalPayable,
                status: loan.status,
            })),
            message: 'Loans fetched successfully',
        };
    }

}
