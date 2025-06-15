import { PartialType } from "@nestjs/mapped-types";
import { CreateEmployeeDto } from "./employeedto";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {

}