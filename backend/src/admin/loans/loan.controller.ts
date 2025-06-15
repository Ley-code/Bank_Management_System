import { Body, Controller, Get, Put } from '@nestjs/common';
import { LoanService } from './loan.service';
import { AcceptLoanRequestDto } from './dto/acceptLoanRequestdto';
import { RejectLoanRequestDto } from './dto/rejectLoanRequestdto';

@Controller('admin/loans')
export class LoanController {

    constructor(
        private readonly loansService: LoanService
    ){}

    @Get('loanRequests')
    getAllLoanRequests(){
        return this.loansService.getAllLoanRequests();
    }

    @Put('loanRequests/accept')
    acceptLoanRequest(@Body() acceptLoanRequestDto: AcceptLoanRequestDto) {
        return this.loansService.acceptLoanRequest(acceptLoanRequestDto);
    }

    @Get('')
    getAllLoans() {
        return this.loansService.getAllLoans();
    }

    @Put('loanRequests/reject')
    rejectLoanRequest(@Body() rejectLoanRequest: RejectLoanRequestDto) {
        return this.loansService.rejectLoanRequest(rejectLoanRequest);
    }
    // @Get('approvedLoans')
    // getAllApprovedLoans() {
    //     return this.loansService.getAllApprovedLoans();
    // }
}
