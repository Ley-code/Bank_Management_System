import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class TransferDto {
    @IsString()
    @IsNotEmpty()
    fromAccountNumber: string;

    @IsString()
    @IsNotEmpty()
    toAccountNumber: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsOptional()
    @IsString()
    notes: string;
}