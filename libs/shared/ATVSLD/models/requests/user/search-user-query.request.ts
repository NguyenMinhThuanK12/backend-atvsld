import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class SearchUserQueryRequest {
  @IsOptional() @IsNumber() @Min(1) page: number = 1;
  @IsOptional() @IsNumber() @Min(1) limit: number = 10;

  @IsOptional() @IsString() full_name?: string;
  @IsOptional() @IsString() account?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() role_id?: string;
  @IsOptional() @IsEnum(UserTypeEnum) user_type?: UserTypeEnum;
}
