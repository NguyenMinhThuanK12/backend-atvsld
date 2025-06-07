import { IsEmail, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { GenderEnum } from 'libs/shared/ATVSLD/enums/gender.enum';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class CreateUserRequest {
  @IsString() username: string;
  @IsString() password: string;
  @IsString() fullName: string;
  @IsString() jobTitle: string;
  @IsEnum(GenderEnum) gender: GenderEnum;
  @IsEnum(UserTypeEnum) userType: UserTypeEnum;
  @IsString() birthday: string; // yyyy-MM-dd
  @IsEmail() email: string;
  @IsString() phoneNumber: string;
  @IsOptional() @IsString() province: string;
  @IsOptional() @IsString() district: string;
  @IsOptional() @IsString() ward: string;
  @IsOptional() @IsString() address: string;
  @IsOptional() @IsString() roleId: string;
  @ValidateIf((o) => o.user_type === UserTypeEnum.BUSINESS)
  @IsString()
  businessId: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() is_active?: boolean;
}
