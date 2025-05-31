import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';

export class SearchRoleQueryRequest extends PaginationQueryRequest {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
