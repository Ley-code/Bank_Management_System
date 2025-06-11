import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/core/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/createCustomerdto';

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer) // Assuming you have a Customer entity
        private readonly customerRepository: Repository<Customer>,
    ) {}
    async createCustomer(createCustomerDto: CreateCustomerDto) {
        if(!createCustomerDto || !createCustomerDto.email) {
            throw new InternalServerErrorException('Invalid customer data');
        }
        // Check if the customer already exists
        const existingCustomer = await this.customerRepository.findOne({
            where: { email: createCustomerDto.email },
        });
        if (existingCustomer) {
            throw new InternalServerErrorException('Customer already exists');
        }
        // Create the customer
        const customer = this.customerRepository.create({
            ...createCustomerDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedCustomer = await this.customerRepository.save(customer);
        return {
            status: 'success',
            data: {
                id: savedCustomer.id,
                email: savedCustomer.email,
                fullName: savedCustomer.fullName,
            },
            message: 'Customer created successfully',
        };
    }

    async getAllCustomers() {
        const customers = await this.customerRepository.find();
        return {
            status: 'success',
            data: customers,
            message: 'Customers retrieved successfully',
        };
    }
}
