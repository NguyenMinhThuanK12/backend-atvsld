import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class SearchUserQueryRequest extends PaginationQueryRequest {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() username?: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsEnum(UserTypeEnum) user_type?: UserTypeEnum;
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsString() businessId?: string;
  @IsOptional() @IsBoolean() is_active?: boolean;
}
