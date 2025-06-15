import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/core/entities/account.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/CreateAccountDto';
import { UpdateAccountDto } from './dto/updateAccountdto';

@Injectable()
export class AccountsService {


    constructor(
        @InjectRepository(Account)
        private readonly accountsRepository: Repository<Account>,
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
    ) {}

    async createAccount(createAccountDto: CreateAccountDto ){
        if (!createAccountDto || !createAccountDto.customerID || !createAccountDto.accountType) {
            throw new Error('Invalid account data');
        } 
        // Check if the customerID exists in the database
        const customer = await this.customerRepository.findOne({
            where: { id: createAccountDto.customerID },
        });
        if (!customer) {
            throw new Error('Customer not found');
        }
        const existingBank = await this.branchRepository.findOne({
            where: { branchName: createAccountDto.branchName },
        });
        if( !existingBank) {
            throw new NotFoundException('Branch not found');
        }
        console.log('balance,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', createAccountDto.balance);
        // Create the account and associate it with the customer
        const account = this.accountsRepository.create({
            ...createAccountDto,
            balance: createAccountDto.balance,
            customer: customer,
            branch: existingBank,
        });
        const savedAccount = await this.accountsRepository.save(account);

        existingBank.totalDeposits+= createAccountDto.balance
        await this.branchRepository.save(existingBank)

        return {
            status: 'success',
            data: {
                savedAccount: {
                    accountNumber: savedAccount.accountNumber,
                    balance: savedAccount.balance,
                },
            },
            message: 'Account created successfully',
        };

    }

    async getAllAccounts(){
        const accounts = await this.accountsRepository.find({
            relations: ['customer', 'branch'],
        });

        if( accounts.length === 0) {
            throw new NotFoundException('No accounts found');
        }
        return {
            status: 'success',
            data: accounts.map(account => ({
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                accountCurrencyCode: account.currencyCode,
                accountHolder: account.customer.fullName,
                accountHolderPhone: account.customer.phone,
                accountBalance: account.balance,   
                accountStatus: account.status,
                accountDateCreated: account.createdAt.toISOString().split('T')[0],  
                branchName: account.branch.branchName,
                
            })),
            message: 'Accounts retrieved successfully',
        };
    }

    async deleteAccount(id: string){
        const account = await this.accountsRepository.findOne({
            where: { accountNumber: id }
        });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        await this.accountsRepository.delete({ accountNumber: id });

        return {
            status : "success"
        }
    }

    async updateAccount(id: string, updateAccountDto: UpdateAccountDto) {
        const account = await this.accountsRepository.findOne({
            where: { accountNumber: id },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        // Update the account properties
        Object.assign(account, updateAccountDto);

        // Save the updated account
        const updatedAccount = await this.accountsRepository.save(account);

        return {
            status: 'success',
            data: {
                updatedAccount: {
                    accountNumber: updatedAccount.accountNumber,
                    balance: updatedAccount.balance,
                    accountType: updatedAccount.accountType,
                    accountCurrencyCode: updatedAccount.currencyCode,
                    accountHolder: updatedAccount.customer.fullName,
                    accountHolderPhone: updatedAccount.customer.phone,
                    accountStatus: updatedAccount.status,
                    accountDateCreated: updatedAccount.createdAt.toISOString().split('T')[0],
                },
            },
            message: 'Account updated successfully',
        };
    }
    
}
