import { IsString, IsNotEmpty, IsUUID, IsDate, IsNumber } from 'class-validator';

export class AcceptLoanRequestDto {
    @IsUUID()
    @IsNotEmpty()
    loanRequestId: string;

    @IsNumber()
    @IsNotEmpty()
    loanDurationInMonths: number;
}