import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/core/entities/account.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Transaction } from 'src/core/entities/transaction.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { LoanRequest } from 'src/core/entities/loanRequest.entity';
import { PaymentModule } from './payment/payment.module';
import { AppNotification } from 'src/core/entities/notification.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Account,Customer,Transaction, Branch, LoanRequest, AppNotification]), PaymentModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
