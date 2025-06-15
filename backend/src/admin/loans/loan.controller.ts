import { Controller, Get } from '@nestjs/common';
import { LoanService } from './loan.service';

@Controller('admin/loans')
export class LoanController {

    constructor(
        private readonly loansService: LoanService
    ){}

    @Get('loanRequests')
    getAllLoanRequests(){
        this.loansService.getAllLoanRequests();
    }
}
