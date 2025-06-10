import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/core/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch])], // Import the Branch entity
  providers: [BranchService],
  controllers: [BranchController]
})
export class BranchModule {}
