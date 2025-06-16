import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/core/entities/branch.entity';
import { Employee } from 'src/core/entities/employee.entity';
import { Department } from 'src/core/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch,Employee, Department])],
  providers: [EmployeeService],
  controllers: [EmployeeController]
})
export class EmployeeModule {}
