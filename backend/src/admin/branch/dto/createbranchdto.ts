import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBranchDto {
    @IsString()
    branchName: string; // Required, unique name of the branch

    @IsOptional()
    @IsString()
    city?: string; // Optional, city where the branch is located

    @IsOptional()
    @IsNumber()
    totalDeposits?: number; // Optional, total deposits in the branch

    @IsOptional()
    @IsNumber()
    totalWithdrawals?: number; // Optional, total withdrawals from the branch

    @IsOptional()
    @IsNumber()
    totalLoans?: number; // Optional, total loans issued by the branch
}

