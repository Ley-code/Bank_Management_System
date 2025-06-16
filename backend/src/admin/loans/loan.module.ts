import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRequest } from 'src/core/entities/loanRequest.entity';
import { BusinessLogicService } from 'src/core/business/BusinessLogic';
import { Loan } from 'src/core/entities/loan.entity';
import { Payment } from 'src/core/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoanRequest, Loan, Payment])],
  providers: [LoanService,BusinessLogicService],
  controllers: [LoanController]
})
export class LoansModule {}
