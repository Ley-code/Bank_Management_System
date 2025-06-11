import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/core/entities/account.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Transaction } from 'src/core/entities/transaction.entity';
import { Branch } from 'src/core/entities/branch.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Account,Customer,Transaction, Branch])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
