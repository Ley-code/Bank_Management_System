import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { EmploymentStatus, LoanRequest, LoanType } from "src/core/entities/loanRequest.entity";

export class LoanRequestDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    purpose: string;

    @IsNotEmpty()
    @IsNumber()
    loanDuration: number;

    @IsNotEmpty()
    loanType: LoanType; // Consider using an enum for loan types      

    @IsNotEmpty()
    @IsNumber()
    monthlyIncome: number;

    @IsNotEmpty()
    employmentStatus: EmploymentStatus;

    @IsOptional()
    @IsString()
    employerName?: string;

    @IsOptional()
    @IsString()
    employerContact?: string;

    @IsOptional()
    @IsString()
    employmentDuration?: string;

    @IsNotEmpty()
    @IsString()
    accountNumber: string; 
}