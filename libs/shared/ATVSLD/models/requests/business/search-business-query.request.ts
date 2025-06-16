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
  registrationCity?: string;

  @IsOptional()
  @IsString()
  registrationDistrict?: string;

  @IsOptional()
  @IsString()
  registrationWard?: string;

  @IsOptional()
  @IsString()
  registrationAddress?: string;
}
