import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/core/entities/account.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Transaction } from 'src/core/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Account, Transaction, Branch])], 
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
