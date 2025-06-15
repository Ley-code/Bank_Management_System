import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class RejectLoanRequestDto {
    @IsUUID()
    @IsNotEmpty()
    loanRequestId: string;

    @IsString()
    @IsOptional()
    reason?: string;
}