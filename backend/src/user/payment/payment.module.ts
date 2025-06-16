import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/core/entities/payment.entity';
import { Account } from 'src/core/entities/account.entity';
import { Transaction } from 'src/core/entities/transaction.entity';
import { AppNotification } from 'src/core/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment,Account,Transaction, AppNotification])],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
