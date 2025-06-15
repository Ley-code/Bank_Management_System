import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WithdrawDto } from './dto/withdrawdto';
import { TransferDto } from './dto/transferdto';
import { Loan } from 'src/core/entities/loan.entity';
import { LoanRequestDto } from './dto/loanRequestdto';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {} 

    @Get(':id/accounts')
    getUserAccounts(@Param('id') id: string) {
        
        return this.userService.getUserAccounts(id);
    }

    @Get(':id/details')
    getUserDetails(@Param('id') id: string) {
        return this.userService.getUserDetails(id);
    }

    @Post('/withdraw')
    withdraw(@Body() withdrawDto: WithdrawDto ) {
        return this.userService.withdrawFromAccount(withdrawDto);
    }

    @Post('/transfer')
    transfer(@Body() transferDto: TransferDto) {
        return this.userService.transferFunds(transferDto);
    }
    @Get(':id/transactions/:accountNumber')
    getUserTransactions(@Param('id') id: string ,@Param('accountNumber') accountNumber: string) {
        return this.userService.getUserTransactions(id, accountNumber);
    }

    @Post('loanRequest')
    requestLoan(@Param('id') id: string, @Body() loanRequestDto: LoanRequestDto) {
        return this.userService.requestLoan(id, loanRequestDto);
    }
    
    @Get(':id/loanRequests/:accountNumber')
    getUserLoanRequests(@Param('id') id: string, @Param('accountNumber') acountNumber: string) {
        return this.userService.getUserLoanRequests(id,acountNumber);
    }

}
