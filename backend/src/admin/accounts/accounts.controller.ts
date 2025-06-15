import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service'; // Adjust the path if necessary
import { CreateAccountDto } from './dto/CreateAccountDto';
import { UpdateAccountDto } from './dto/updateAccountdto';
@Controller('admin/accounts')
export class AccountsController {


    constructor(private accountsService: AccountsService) {}
    @Post('')
    createAccount(@Body() createAccountDto: CreateAccountDto) {
        return this.accountsService.createAccount(createAccountDto);
    }

    @Get('')
    getAllAccounts() {
        return this.accountsService.getAllAccounts();
    }

    @Delete(':id')
    deleteAccount(@Param('id') id: string){
        return this.accountsService.deleteAccount(id)
    }

    @Put(':id')
    updateAccount(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountsService.updateAccount(id, updateAccountDto);
    }
}
