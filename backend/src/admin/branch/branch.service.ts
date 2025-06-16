import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Branch } from 'src/core/entities/branch.entity';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/createbranchdto';
import { UpdateBranchDto } from './dto/updatebranchdto';

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
        const branches = await this.branchRepository.find({
            relations: ['accounts', 'employees'],
        });
        return {
            status: 'success',
            data: branches.map((branch) => ({
                branchName: branch.branchName,
                city: branch.city,
                totalDeposits: branch.totalDeposits,
                totalWithdrawals: branch.totalWithdrawals,
                totalLoans: branch.totalLoans,
                totalAccounts: branch.accounts ? branch.accounts.length : 0,
                totalemployee: branch.employees ? branch.employees.length : 0,
                createdAt: branch.createdAt.toISOString().split('T')[0], // Format date to YYYY-MM-DD
            })),
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

    async deleteBranch(branchName: string) {
        const branch = await this.branchRepository.findOne({
            where: { branchName: branchName },
        });
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }
        await this.branchRepository.remove(branch);
        return {
            status: 'success',
            message: 'Branch deleted successfully',
        };
    }
    async updateBranch(branchName: string, updateBranchDto: UpdateBranchDto) {
        const branch = await this.branchRepository.findOne({
            where: { branchName: branchName },
        });
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }
        const updatedBranch = Object.assign(branch, {...updateBranchDto, updatedAt: new Date()});
        await this.branchRepository.update(branch.branchName, updatedBranch);
        return {
            status: 'success',
            data: updatedBranch,
            message: 'Branch updated successfully',
        };
    }
}
