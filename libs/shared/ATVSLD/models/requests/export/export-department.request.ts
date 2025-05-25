import { IsArray, IsNumber, IsOptional } from "class-validator";

export class ExportDepartmentRequest {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    ids?: number[];
  }