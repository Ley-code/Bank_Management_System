import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/core/entities/branch.entity';
import { Employee } from 'src/core/entities/employee.entity';
import { In, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/employeedto';
import { UpdateEmployeeDto } from './dto/updateemployeedto';
import { Department } from 'src/core/entities/department.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}
  async getAllEmployees() {
    // This is a placeholder implementation. Replace with actual database logic.
    const employees = await this.employeeRepository.find({
      relations: ['branch', 'supervisor','department'],
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
        department: employee.department.name,
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
        department: employee.department.name,
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

    const department = await this.departmentRepository.findOne({
      where: { name: createEmployeeDto.departmentName},
    });

    if (!department) {
      throw new BadRequestException('Department not found');
    }

    let supervisor: Employee | undefined = undefined;
    if (createEmployeeDto.supervisorId) {
      supervisor =
        (await this.employeeRepository.findOne({
          where: { id: createEmployeeDto.supervisorId },
        })) || undefined;
    }
    

    // Create the employee and associate it with the branch and supervisor
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      department: department,
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
    async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: ['branch', 'supervisor'],
        });
        if (!employee) {
            throw new BadRequestException('Employee not found');
        }
        // Update the employee's properties
        Object.assign(employee, {...updateEmployeeDto, updatedAt: new Date()});

        // If branchName is provided, find the branch and assign it
        if (updateEmployeeDto.branchName) {
            const branch = await this.branchRepository.findOne({
                where: { branchName: updateEmployeeDto.branchName },
            });
            if (!branch) {
                throw new BadRequestException('Branch not found');
            }
            employee.branch = branch;
        }

        // If supervisorId is provided, find the supervisor and assign it
        if (updateEmployeeDto.supervisorId) {
            const supervisor = await this.employeeRepository.findOne({
                where: { id: updateEmployeeDto.supervisorId },
            });
            if (!supervisor) {
                throw new BadRequestException('Supervisor not found');
            }
            employee.supervisor = supervisor;
        }

        const updatedEmployee = await this.employeeRepository.save(employee);
        return {
            status: 'success',
            data: {
                id: updatedEmployee.id,
                name: updatedEmployee.fullName,
                email: updatedEmployee.email,
                position: updatedEmployee.position,
                branch: updatedEmployee.branch ? updatedEmployee.branch.branchName : 'No branch assigned',
                supervisor: updatedEmployee.supervisor ? updatedEmployee.supervisor.fullName : 'No supervisor assigned',
            },
            message: 'Employee updated successfully',
        };
    }
    async deleteEmployee(id: string) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
        });
        if (!employee) {
            throw new BadRequestException('Employee not found');
        }
        await this.employeeRepository.remove(employee);
        return {
            status: 'success',
            message: 'Employee deleted successfully',
        };
    }
}
