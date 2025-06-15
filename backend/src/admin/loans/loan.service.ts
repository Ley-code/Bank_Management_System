import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/core/entities/loan.entity';
import { LoanRequest, LoanRequestStatus, LoanType } from 'src/core/entities/loanRequest.entity';
import { Repository } from 'typeorm';
import { AcceptLoanRequestDto } from './dto/acceptLoanRequestdto';
import { addMonths } from 'date-fns';
import { BusinessLogicService } from 'src/core/business/BusinessLogic';
import { RejectLoanRequestDto } from './dto/rejectLoanRequestdto';

@Injectable()
export class LoanService {

    constructor(
        @InjectRepository(LoanRequest)
        private readonly loanRequestsRepository: Repository<LoanRequest>,
        @InjectRepository(Loan)
        private readonly loanRepository: Repository<Loan>,
        private readonly businessService: BusinessLogicService, // Assuming you have a BusinessService to handle business logic
        
    ){}
    async acceptLoanRequest({ loanRequestId, loanDurationInMonths }: AcceptLoanRequestDto) {
        const loanRequest = await this.loanRequestsRepository.findOne({
            where: { id: loanRequestId },
            relations: ['account', 'account.customer'],
        });

        if (!loanRequest) {
            throw new NotFoundException('Loan request not found');
        }

        loanRequest.status = LoanRequestStatus.APPROVED;
        await this.loanRequestsRepository.save(loanRequest);

        const issuedAt = new Date();
        const dueDate = addMonths(issuedAt, loanDurationInMonths);

        const interestRate = 0.07; // TODO: Replace with dynamic rate if needed
        const annualRate = 7; // TODO: Replace with dynamic rate if needed

        const loan = this.loanRepository.create({
            dueDate,
            issuedAt,
            loanDurationInMonths,
            totalPayable: this.businessService.calculateTotalPayable(loanRequest.amount, interestRate),
            monthlyPayment: this.businessService.calculateMonthlyPayment(loanRequest.amount, annualRate, loanDurationInMonths),
            account: loanRequest.account,
            loanRequest,
        });

        await this.loanRepository.save(loan);

        return {
            status: 'success',
            message: 'Loan request accepted successfully',
            data: {
                accountNumber: loanRequest.account.accountNumber,
                customerName: loanRequest.account.customer.fullName,
                amountApproved: loanRequest.amount,
                loanType: loanRequest.loanType,
            },
        };
    }
    async rejectLoanRequest(rejectLoanRequestdto: RejectLoanRequestDto) {
        const loanRequest = await this.loanRequestsRepository.findOne({
            where: { id:  rejectLoanRequestdto.loanRequestId },
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
    async getAllLoanRequests(){
        const loanRequests = await this.loanRequestsRepository.find({
            relations: ['account']
        })

        if(loanRequests.length == 0){
            throw new NotFoundException('No loan requests');
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
            throw new NotFoundException('No loans found');
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
