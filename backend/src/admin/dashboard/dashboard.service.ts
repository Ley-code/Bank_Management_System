import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountType, StatusType } from 'src/core/entities/account.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Transaction } from 'src/core/entities/transaction.entity';
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

    private async sumBranchField(field: 'totalDeposits' | 'totalWithdrawals'): Promise<number> {
        const result = await this.branchRepository
            .createQueryBuilder('branch')
            .select(`SUM(branch.${field})`, field)
            .getRawOne();
        return parseInt(result?.[field] ?? '0');
    }

    private async countAccountsByStatus(status: StatusType): Promise<number> {
        return this.accountRepository.count({ where: { status } });
    }

    private async countAccountsByType(type: AccountType): Promise<number> {
        return this.accountRepository.count({ where: { accountType: type } });
    }

    async getDashboardData() {
        const [
            totalCustomers,
            totalAccounts,
            totalTransactions,
            totalDeposits,
            totalBranches,
            totalWithdrawals,
            activeAccounts,
            closedAccounts,
            savingsAccounts,
            checkingAccounts,
            monthlyVolume,
        ] = await Promise.all([
            this.customerRepository.count(),
            this.accountRepository.count(),
            this.transactionRepository.count(),
            this.sumBranchField('totalDeposits'),
            this.branchRepository.count(),
            this.sumBranchField('totalWithdrawals'),
            this.countAccountsByStatus(StatusType.ACTIVE),
            this.countAccountsByStatus(StatusType.CLOSED),
            this.countAccountsByType(AccountType.SAVINGS),
            this.countAccountsByType(AccountType.CHECKING),
            this.transactionRepository
            .createQueryBuilder('transaction')
            .select("DATE_TRUNC('month', transaction.createdAt)", 'month')
            .addSelect('SUM(transaction.amount)', 'totalAmount')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany()
            
        ]);

        return {
            status: 'success',
            data: {
            totalCustomers,
            totalAccounts,
            totalTransactions,
            totalDeposits,
            totalBranches,
            totalWithdrawals,
            activeAccounts,
            closedAccounts,
            accountTypeDistribution: {
                savingsAccounts,
                checkingAccounts,
            },
            monthlyVolume: monthlyVolume.map(item => ({
                month: new Date(item.month).toLocaleString('en-US', { month: 'long' }).toLowerCase(), 
                totalAmount: parseFloat(item.totalAmount),
            })),
            },
            message: 'Dashboard data retrieved successfully',
        };
    }
}
