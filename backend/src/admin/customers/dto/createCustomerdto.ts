import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    subCity: string;

    @IsString()
    @IsNotEmpty()
    woreda: string;

    @IsString()
    @IsNotEmpty()
    houseNumber: string;

    @IsString()
    @IsNotEmpty()
    zone: string;
}