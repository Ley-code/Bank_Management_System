import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('user')
export class PaymentController {

    constructor(
        private readonly paymentService: PaymentService
    ) {}

    @Post('/payment')
    async confirmPayment(
        @Body('paymentId') paymentId: string,
        @Body('accountId') accountId: string
    ) {
        return this.paymentService.confirmPayment(paymentId, accountId);
    }

    @Get('/payments/:loanId')
    async getLoanPayments(@Param('loanId')  loanId : string) {
        return this.paymentService.getLoanPayments(loanId);
    }
}
