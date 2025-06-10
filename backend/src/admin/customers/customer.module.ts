import { Module } from '@nestjs/common';
import { CustomerController, } from './customer.controller';
import { CustomerService, } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/core/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])], // Add your entities here if needed
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
