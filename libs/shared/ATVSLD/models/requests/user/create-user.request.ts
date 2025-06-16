import { IsDefined, IsEmail, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { GenderEnum } from 'libs/shared/ATVSLD/enums/gender.enum';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class CreateUserRequest {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  jobTitle: string;
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsEnum(UserTypeEnum)
  userType: UserTypeEnum;
  @IsOptional()
  @IsString()
  birthday?: string; // yyyy-MM-dd

  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // Vai trò: BẮT BUỘC nếu là ADMIN
  @ValidateIf((o) => o.userType === UserTypeEnum.ADMIN)
  @IsDefined({ message: 'Vai trò là bắt buộc với tài khoản ADMIN' })
  @IsString()
  roleId?: string;

  // Doanh nghiệp: BẮT BUỘC nếu là BUSINESS
  @ValidateIf((o) => o.userType === UserTypeEnum.BUSINESS)
  @IsDefined({ message: 'Doanh nghiệp là bắt buộc với tài khoản BUSINESS' })
  @IsString()
  businessId?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
