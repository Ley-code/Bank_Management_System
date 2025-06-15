import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/employeedto';
import { UpdateEmployeeDto } from './dto/updateemployeedto';

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
    @Put(':id')
    updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(id, updateEmployeeDto);
    }

    @Delete(':id')
    deleteEmployee(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }
}
