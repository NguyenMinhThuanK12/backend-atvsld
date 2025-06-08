import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class SearchUserQueryRequest extends PaginationQueryRequest {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() username?: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsEnum(UserTypeEnum) userType?: UserTypeEnum;
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsString() businessId?: string;
  @IsOptional() @IsString() isActive?: string;
}
