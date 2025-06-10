import { AccountType } from "src/core/entities/account.entity";

export class CreateAccountResponseDto {
    status: string;
    data: {
        accountNumber: string;
        accountType: AccountType;
        balance: number;
    };
    message: string;
}