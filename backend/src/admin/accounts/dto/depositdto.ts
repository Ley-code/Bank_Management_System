import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DepositDto {
    @IsString()
    @IsNotEmpty()
    accountNumber: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsOptional()
    @IsString()
    description?: string;
}