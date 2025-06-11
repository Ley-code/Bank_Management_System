import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class WithdrawDto {
    @IsNotEmpty()
    @IsString()
    accountNumber: string; // Required, the account number to deposit into

    @IsNotEmpty()
    @IsNumber()
    amount: number; // Required, the amount to deposit

}