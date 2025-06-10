import { Body, Controller, Get, Post } from '@nestjs/common';
import { BranchService } from './branch.service';

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

}
