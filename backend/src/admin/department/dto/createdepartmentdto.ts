import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty()
    floorNumber: string;

    @IsString()
    @IsNotEmpty()
    buildingNumber: string;
}