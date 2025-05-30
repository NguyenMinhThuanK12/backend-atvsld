import { IsEmail, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { GenderEnum } from 'libs/shared/ATVSLD/enums/gender.enum';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class CreateUserRequest {
  @IsString() account: string;
  @IsString() password: string;
  @IsString() full_name: string;
  @IsString() job_title: string;
  @IsEnum(GenderEnum) gender: GenderEnum;
  @IsEnum(UserTypeEnum) user_type: UserTypeEnum;
  @IsString() birthday: string; // yyyy-MM-dd
  @IsEmail() email: string;
  @IsString() phone: string;
  @IsString() role_id: string;
  @ValidateIf((o) => o.user_type === UserTypeEnum.BUSINESS)
  @IsString()
  business_id: string;
  @IsOptional() @IsString() avatar_url?: string;
  @IsOptional() is_active?: boolean;
}
