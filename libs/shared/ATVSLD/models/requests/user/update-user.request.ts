import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from 'libs/shared/ATVSLD/enums/gender.enum';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class UpdateUserRequest {
  @IsOptional() @IsString() account?: string;
  @IsOptional() @IsString() full_name?: string;
  @IsOptional() @IsString() job_title?: string;
  @IsOptional() @IsEnum(GenderEnum) gender?: GenderEnum;
  @IsOptional() @IsEnum(UserTypeEnum) user_type?: UserTypeEnum;
  @IsOptional() @IsString() birthday?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() role_id?: string;
  @IsOptional() @IsString() business_id?: string;
  @IsOptional() @IsString() avatar_url?: string;
  @IsOptional() is_active?: boolean;
}
