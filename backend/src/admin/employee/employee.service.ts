import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/core/entities/branch.entity';
import { Employee } from 'src/core/entities/employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/employeedto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}
  async getAllEmployees() {
    // This is a placeholder implementation. Replace with actual database logic.
    const employees = await this.employeeRepository.find({
      relations: ['branch', 'supervisor'],
    });
    console.log('Employees:');
    return {
      status: 'success',
      data: employees.map((employee) => ({
        id: employee.id,
        name: employee.fullName,
        email: employee.email,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        branch: employee.branch
          ? employee.branch.branchName
          : 'No branch assigned',
        position: employee.position,
        supervisor: employee.supervisor
          ? employee.supervisor.fullName
          : 'No supervisor assigned',
        salary: employee.salary,
        dateOfJoining: employee.createdAt.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      })),
      message:
        employees.length == 0
          ? 'No Employees found'
          : 'Employees retrieved successfully',
    };
  }
  async getEmployeeById(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['branch', 'supervisor'],
    });
    if (!employee) {
      throw new BadRequestException('Employee not found');
    }
    return {
      status: 'success',
      data: {
        id: employee.id,
        name: employee.fullName,
        email: employee.email,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        branch: employee.branch
          ? employee.branch.branchName
          : 'No branch assigned',
        position: employee.position,
        supervisor: employee.supervisor
          ? employee.supervisor.fullName
          : 'No supervisor assigned',
        salary: employee.salary,
        dateOfJoining: employee.createdAt.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      },
      message: 'Employee retrieved successfully',
    };
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    if (
      !createEmployeeDto ||
      !createEmployeeDto.fullName ||
      !createEmployeeDto.email
    ) {
      throw new BadRequestException('Invalid employee data');
    }
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email: createEmployeeDto.email },
    });
    if (existingEmployee) {
      throw new BadRequestException('Employee with this email already exists');
    }
    // You should inject BranchRepository and use it to find the branch
    const branch = await this.branchRepository.findOne({
      where: { branchName: createEmployeeDto.branchName },
    });
    if (!branch) {
      throw new BadRequestException('Branch not found');
    }

    let supervisor: Employee | undefined = undefined;
    if (createEmployeeDto.supervisorId) {
      supervisor =
        (await this.employeeRepository.findOne({
          where: { id: createEmployeeDto.supervisorId },
        })) || undefined;
    }
    console.log('Branch:', branch);
    console.log(
      '-----------------------------------------------------------------------',
    );
    console.log('Supervisor:', supervisor);
    // Create the employee and associate it with the branch and supervisor
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      branch: branch,
      supervisor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedEmployee = await this.employeeRepository.save(employee);
    return {
      status: 'success',
      data: {
        id: savedEmployee.id,
        name: savedEmployee.fullName,
        email: savedEmployee.email,
        position: savedEmployee.position,
        branch: savedEmployee.branch
          ? savedEmployee.branch.branchName
          : 'No branch assigned',
      },
      message: 'Employee created successfully',
    };
  }
}
