import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Branch } from 'src/core/entities/branch.entity';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/createbranchdto';

@Injectable()
export class BranchService {

    constructor(
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
    ) {}

    async createBranch(createBranchDto: CreateBranchDto) {
        if (!createBranchDto || !createBranchDto.branchName) {
            throw new InternalServerErrorException('Invalid branch data');
        }
        const existingBranch = await this.branchRepository.findOne({
            where: { branchName: createBranchDto.branchName },
        });
        if (existingBranch) {
            throw new InternalServerErrorException('Branch already exists');
        }
        const branch = this.branchRepository.create(createBranchDto);
        const savedBranch = await this.branchRepository.save(branch);
        return {
            status: 'success',
            data: {
                branchName: savedBranch.branchName,
            },
            message: 'Branch created successfully',
        };
    }
    async getAllBranches() {
        const branches = await this.branchRepository.find();
        return {
            status: 'success',
            data: branches,
            message: 'Branches retrieved successfully',
        };
    }
    async getBranchByname(branchName: string) {
        const branch = await this.branchRepository.findOne({
            where: { branchName: branchName },
        });
        if (!branch) {
            throw new Error('Branch not found');
        }
        return {
            status: 'success',
            data: branch,
            message: 'Branch retrieved successfully',
        };
    }
}
