import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './CreateAccountDto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {

    @IsString()
    @IsOptional()
    status: string;
}