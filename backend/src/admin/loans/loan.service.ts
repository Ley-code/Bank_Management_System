import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRequest, LoanType } from 'src/core/entities/loanRequest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoanService {

    constructor(
        @InjectRepository(LoanRequest)
        private readonly loanRequestsRepository: Repository<LoanRequest>
    ){}

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
}
