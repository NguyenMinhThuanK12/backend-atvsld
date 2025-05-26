import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { IsOptional, IsString } from 'class-validator';

export class SearchBusinessQueryRequest extends PaginationQueryRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  mainBusinessField: string;

  @IsOptional()
  @IsString()
  operationCity?: string;

  @IsOptional()
  @IsString()
  operationDistrict?: string;

  @IsOptional()
  @IsString()
  operationWard?: string;

  @IsOptional()
  @IsString()
  operationAddress?: string;
}
