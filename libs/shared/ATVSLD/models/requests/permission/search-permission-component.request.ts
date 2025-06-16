import { IsOptional, IsString } from 'class-validator';

export class SearchPermissionComponentRequest {
  @IsOptional()
  @IsString()
  parentCode?: string;
}
