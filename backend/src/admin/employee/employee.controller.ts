import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/employeedto';

@Controller('admin/employee')
export class EmployeeController {

    constructor(
        private readonly employeeService: EmployeeService
    ) {}

    @Get('')
    getAllEmployees() {
        return this.employeeService.getAllEmployees();
    }
    @Get(':id')
    getEmployeeById(@Param('id') id: string) {
        return this.employeeService.getEmployeeById(id);
    }
    @Post('')
    createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(createEmployeeDto);
    }
}
