import { IsEmail, IsOptional, IsString, IsNotEmpty, MinLength, IsNumber, IsUUID } from 'class-validator';

export class CreateEmployeeDto {

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    position: string;

    @IsNotEmpty()
    @IsNumber()
    salary: number;

    @IsNotEmpty()
    @IsString()
    branchName: string;

    @IsOptional()
    @IsUUID()
    supervisorId?: string;
}
