import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BranchService } from './branch.service';
import { UpdateBranchDto } from './dto/updatebranchdto';

@Controller('admin/branch')
export class BranchController {


    constructor(private readonly branchService: BranchService) {} 
    @Post()
    createBranch(@Body() createBranchDto: any) {
        // Logic to create a branch
        return this.branchService.createBranch(createBranchDto);
    }

    @Get()
    getAllBranches() {
        // Logic to get all branches
        return this.branchService.getAllBranches();
    }

    @Delete(':branchName')
    deleteBranch(@Body('branchName') branchName: string) {
        return this.branchService.deleteBranch(branchName);
    }

    @Put(':branchName')
    updateBranch(@Param('branchName') branchName: string, @Body() updateBranchDto: UpdateBranchDto) {
        // Logic to update a branch
        return this.branchService.updateBranch(branchName, updateBranchDto);
    }

}
