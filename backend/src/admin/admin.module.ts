import { Module } from '@nestjs/common';
import { Account } from 'src/core/entities/account.entity';
import { AccountsModule } from './accounts/accounts.module';
import { CustomerModule } from './customers/customer.module';

import { BranchModule } from './branch/branch.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/core/entities/transaction.entity';
import { Branch } from 'src/core/entities/branch.entity';
import { EmployeeModule } from './employee/employee.module';
import { LoansModule } from './loans/loan.module';
import { AppNotification } from 'src/core/entities/notification.entity';
import { DepartmentModule } from './department/department.module';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction, Account,Branch,AppNotification]), AccountsModule,CustomerModule, BranchModule, DashboardModule, EmployeeModule, LoansModule, DepartmentModule],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [],
})
export class AdminModule {}
