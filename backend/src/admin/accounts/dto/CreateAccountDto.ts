import { AccountType } from "src/core/entities/account.entity";
import { IsNotEmpty, IsString, IsNumber, IsEnum } from "class-validator";

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
    initialBalance: number;

    @IsNotEmpty()
    @IsString()
    branchName: string;
}