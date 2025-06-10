import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCustomerDto } from './dto/createCustomerdto';
import { CustomerService } from './customer.service';

@Controller('admin/customers') // Define the base route for this controller
export class CustomerController {


    constructor(private readonly customerService: CustomerService) {} // Replace 'any' with the actual type of your service
    
    @Get()
    findAll() {
        return this.customerService.getAllCustomers();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // Return a single user by id
        return `This action returns a user with id: ${id}`;
    }

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.createCustomer(createCustomerDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: any) {
        // Update a user by id
        return `This action updates a user with id: ${id}`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        // Remove a user by id
        return `This action removes a user with id: ${id}`;
    }
}
