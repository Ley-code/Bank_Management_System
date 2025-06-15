import { AccountType } from "src/core/entities/account.entity";
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from "class-validator";

export class CreateAccountDto {
    @IsNotEmpty()
    @IsString()
    customerID: string;

    @IsNotEmpty()
    @IsEnum(AccountType)
    accountType: AccountType;

    @IsNotEmpty()
    @IsString()
    currencyCode: string;

    @IsNotEmpty()
    @IsNumber()
    balance: number;

    @IsNotEmpty()
    @IsString()
    branchName: string;

}