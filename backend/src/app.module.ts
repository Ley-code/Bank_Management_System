import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module'; // Adjust the path as necessary

import { CustomerModule } from './admin/customers/customer.module';
import { AdminModule } from './admin/admin.module';
import { AccountsService } from './admin/accounts/accounts.service';
import { AccountsController } from './admin/accounts/accounts.controller';
import { AccountsModule } from './admin/accounts/accounts.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', 
  }) , DatabaseModule, CustomerModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
