import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/core/entities/account.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Repository} from 'typeorm';
import { WithdrawDto } from './dto/withdrawdto';
import { Branch } from 'src/core/entities/branch.entity';
import { Transaction } from 'src/core/entities/transaction.entity';
import { TransferDto } from './dto/transferdto';
@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
        @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
        @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    ) {}

    async getUserDetails(customerId: string) {
        const customer = await this.customerRepository.findOne({
            where: { id: customerId },
            relations: ['accounts'],
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        return {
            status: 'success',
            data: {
                id: customer.id,
                email: customer.email,
                fullName: customer.fullName,
                
            },
            message: 'User details retrieved successfully',
        };
    }

    async getUserAccounts(id: string) {
        const accounts = await this.accountRepository.find({
            where: { customer: { id } },
            relations: ['customer'],
        });

        if (!accounts || accounts.length === 0) {
            throw new NotFoundException('No accounts found for this user');
        }

        return {
            status: 'success',
            data: accounts.map(myaccount => ({
                accountNumber: myaccount.accountNumber,
                balance: myaccount.balance,
                accountType: myaccount.accountType,
            })),
            message: 'User accounts retrieved successfully',
        };
    }

    async withdrawFromAccount(withdrawalDto: WithdrawDto) {
        const { accountNumber, amount } = withdrawalDto;

        if (amount <= 0) {
            throw new BadRequestException('Withdrawal amount must be greater than zero');
        }

        const myaccount = await this.accountRepository.findOne({
            where: { accountNumber },
            relations: ['branch'],
        });

        if (!myaccount) {
            throw new NotFoundException('Account not found');
        }

        if (myaccount.balance < amount) {
            throw new BadRequestException('Insufficient balance for withdrawal');
        }
        const mybranch = await this.branchRepository.findOne({
            where: { branchName: myaccount.branch.branchName },
        });
        myaccount.balance -= amount;
        myaccount.updatedAt = new Date();
        if (mybranch) {
            mybranch.totalWithdrawals += amount;
            console.log('Total withdrawals for branch:', mybranch.totalWithdrawals);
            await this.branchRepository.save(mybranch);
        }
        await this.accountRepository.save(myaccount);
        // Create a new transaction record
        const newTransaction = this.transactionRepository.create({
            account: myaccount,
            amount,
            type: 'withdrawal',
            direction: "debit",
            date: new Date(),
            notes: `withdrawal of ${amount} from account ${accountNumber}`
        });
        await this.transactionRepository.save(newTransaction);

        return {
            status: 'success',
            data: {
                accountNumber: myaccount.accountNumber,
                newBalance: myaccount.balance,
            },
            message: 'Withdrawal successful',
        };
    }

    async transferFunds(transferDto: TransferDto ) {
        const { fromAccountNumber, amount, toAccountNumber } = transferDto;

        if (amount <= 0) {
            throw new BadRequestException('Transfer amount must be greater than zero');
        }

        const fromAccount = await this.accountRepository.findOne({
            where: { accountNumber: fromAccountNumber },
            relations: ['branch']
        });

        if (!fromAccount) {
            throw new NotFoundException('Source account not found');
        }

        if (fromAccount.balance < amount) {
            throw new BadRequestException('Insufficient balance for transfer');
        }

        const toAccount = await this.accountRepository.findOne({
            where: { accountNumber: toAccountNumber },
            relations: ['branch']
        });

        if (!toAccount) {
            throw new NotFoundException('Destination account not found');
        }

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await this.accountRepository.save(fromAccount);
        await this.accountRepository.save(toAccount);

        // Update branch totals if branches are different
        if (fromAccount.branch.branchName !== toAccount.branch.branchName) {
            // Update totalWithdrawals for fromAccount's branch
            fromAccount.branch.totalWithdrawals += amount;
            await this.branchRepository.save(fromAccount.branch);

            // Update totalDeposits for toAccount's branch
            toAccount.branch.totalDeposits += amount;
            await this.branchRepository.save(toAccount.branch);
        }
        //create a group tx id generator
        const groupTransactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

        // Create a new transaction record for the withdrawal
        const withdrawalTransaction = this.transactionRepository.create({
            account: fromAccount,
            amount,
            type: 'transfer',
            direction: 'debit',
            date: new Date(),
            transactionGroupId: groupTransactionId,
            notes: transferDto.notes,
        });

        // Create a new transaction record for the deposit
        const depositTransaction = this.transactionRepository.create({
            account: toAccount,
            amount,
            type: 'transfer',
            direction: 'credit',
            date: new Date(),
            transactionGroupId: groupTransactionId,
            notes: transferDto.notes,
        });

        await this.transactionRepository.save(withdrawalTransaction);
        await this.transactionRepository.save(depositTransaction);

        return {
            status: 'success',
            data: {
                fromAccountNumber: fromAccount.accountNumber,
                toAccountNumber: toAccount.accountNumber,
                transferredAmount: amount,
                fromNewBalance: fromAccount.balance,
                toNewBalance: toAccount.balance,
            },
            message: 'Transfer successful',
        };
    }
}
