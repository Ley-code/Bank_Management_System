import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreateBranchDto } from "./createbranchdto";

export class UpdateBranchDto extends PartialType(
  OmitType(CreateBranchDto, ['branchName'] as const)
) {}