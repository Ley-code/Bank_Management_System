import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRequest } from 'src/core/entities/loanRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoanRequest])],
  providers: [LoanService],
  controllers: [LoanController]
})
export class LoansModule {}
