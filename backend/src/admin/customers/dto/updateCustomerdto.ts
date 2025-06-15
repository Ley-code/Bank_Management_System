import { PartialType } from "@nestjs/mapped-types";
import { CreateCustomerDto } from "./createCustomerdto";

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {

}