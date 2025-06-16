import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/createdepartmentdto';
import { Department } from 'src/core/entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async findAll() {
    const departments = await this.departmentRepository.find();
    if (!departments || departments.length === 0) {
      return {
        status: 'error',
        message: 'No departments found',
        data: [],
      };
    }
    return {
      status: 'success',
      data: departments.map(department => ({
        name: department.name,
        description: department.description,
        createdAt: department.createdAt.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      })),
      message: 'Departments retrieved successfully',
    };
  }

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      createdAt: new Date(),
    });
    await this.departmentRepository.save(department);
    return {
      status: 'success',
      data: {
        departmentName: department.name,
        description: department.description,
        createdAt: department.createdAt.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      },
      message: 'Department created successfully',
    };

  }
}
