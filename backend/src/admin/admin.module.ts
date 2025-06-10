import { Module } from '@nestjs/common';
import { Account } from 'src/core/entities/account.entity';
import { AccountsModule } from './accounts/accounts.module';
import { CustomerModule } from './customers/customer.module';

import { BranchModule } from './branch/branch.module';

@Module({
    imports: [AccountsModule,CustomerModule, BranchModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class AdminModule {}
