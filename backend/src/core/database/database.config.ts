/* eslint-disable prettier/prettier */

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { Account } from '../entities/account.entity';
import { Branch } from '../entities/branch.entity';
import { Transaction } from '../entities/transaction.entity';
import { Loan } from '../entities/loan.entity';
import { Payment } from '../entities/payment.entity';
import { Employee } from '../entities/employee.entity';
import { LoanRequest } from '../entities/loanRequest.entity';
export default registerAs('database', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
      Customer,
      Account,
      Branch,
      Transaction,
      Loan,
      Payment,
      Employee,
      LoanRequest

    ],
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
    // ssl:{
    //   rejectUnauthorized: false, // This is important for self-signed certificates
    //   // You can also provide a certificate if needed
    //   // ca: process.env.DATABASE_SSL_CA ? process.env.DATABASE_SSL_CA : undefined,
    // }
  };
});

