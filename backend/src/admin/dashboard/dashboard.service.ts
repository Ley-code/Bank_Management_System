import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/core/entities/account.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Transaction  } from 'src/core/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,

        @InjectRepository(Branch)
        private branchRepository: Repository<Branch>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) {}
    async getDashboardData() {
        const totalCustomers = await this.customerRepository.count();
        const totalAccounts = await this.accountRepository.count(); 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        const totalTransactions = await this.transactionRepository.count()
        const totalDeposits = await this.branchRepository
            .createQueryBuilder('branch')
            .select('SUM(branch.totalDeposits)', 'totalDeposits')
            .getRawOne();
        const totalBranches = await this.branchRepository.count();
        const totalWithdrawals = await this.branchRepository
            .createQueryBuilder('branch')
            .select('SUM(branch.totalWithdrawals)', 'totalWithdrawals')
            .getRawOne();
        console.log('------------------------------------------------------------')
        console.log('totalCustomers', totalDeposits);
        return {
            status: 'success',
            data: {
                totalCustomers,
                totalAccounts,
                totalTransactions,
                totalDeposits: parseInt(totalDeposits.totalDeposits),
                totalBranches,
                totalWithdrawals: parseInt(totalWithdrawals.totalWithdrawals),
            },
            message: 'Dashboard data retrieved successfully',
        };

    }

}
