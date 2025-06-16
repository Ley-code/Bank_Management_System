import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './CreateAccountDto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusType } from 'src/core/entities/account.entity';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {

    @IsString()
    @IsOptional()
    @IsEnum(StatusType)
    status: string;

    
}