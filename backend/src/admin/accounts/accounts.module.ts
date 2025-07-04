import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account } from 'src/core/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/core/entities/customer.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { Transaction } from 'src/core/entities/transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Account,Customer,Branch, Transaction])], // Assuming you have an Account entity
    controllers: [AccountsController],
    providers: [AccountsService],
})
export class AccountsModule {}
