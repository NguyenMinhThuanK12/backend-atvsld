import { IsArray, IsNumber, IsOptional } from "class-validator";

export class ExportBusinessRequest {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    ids?: number[];
  }