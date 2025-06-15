import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/core/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/createCustomerdto';
import { UpdateCustomerDto } from './dto/updateCustomerdto';

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

    async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto) {
        const customer = await this.customerRepository.findOne({
            where: { id },
        });
        if (!customer) {
            throw new InternalServerErrorException('Customer not found');
        }
        // Update the customer
        Object.assign(customer, updateCustomerDto);
        customer.updatedAt = new Date();
        const updatedCustomer = await this.customerRepository.save(customer);
        return {
            status: 'success',
            data: {
                id: updatedCustomer.id,
                email: updatedCustomer.email,
                fullName: updatedCustomer.fullName,
            },
            message: 'Customer updated successfully',
        };
    }

    async deleteCustomer(id: string) {
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: ['accounts'], // Make sure 'accounts' is the correct relation name
        });
        if (!customer) {
            throw new InternalServerErrorException('Customer not found');
        }
        // Remove all accounts associated with the customer
        if (customer.accounts && customer.accounts.length > 0) {
            await this.customerRepository.manager.remove(customer.accounts);
        }
        await this.customerRepository.remove(customer);
        return {
            status: 'success',
            message: 'Customer and associated accounts deleted successfully',
        };
    }
}
