import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/core/entities/account.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/core/entities/customer.entity';
import { CreateAccountDto } from './dto/CreateAccountDto';
import { Branch } from 'src/core/entities/branch.entity';

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
        // Create the account and associate it with the customer
        const account = this.accountsRepository.create({
            ...createAccountDto,
            customer: customer,
            branch: existingBank,
        });
        const savedAccount = await this.accountsRepository.save(account);

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

    async getAllAcounts(){
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
                currencyCode: account.currencyCode,
                fullname: account.customer.fullName,
                balance: account.balance,            
                branchName: account.branch.branchName,
                
            })),
            message: 'Accounts retrieved successfully',
        };
    }
    
}
