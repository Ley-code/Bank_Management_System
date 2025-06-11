import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AdminService } from './admin.service';
import { DepositDto } from './accounts/dto/depositdto';

@Controller('admin')
export class AdminController {

    constructor(
        private readonly adminService: AdminService
    ) {} 

    @Get('/transactions')
    getAllTransactions() {
        return this.adminService.getAllTransactions();
    }

    @Post('/deposit')
    deposit(@Body() depositDto: DepositDto) {
        return this.adminService.deposit(depositDto);
    }

}
