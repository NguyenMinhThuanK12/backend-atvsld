import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from 'libs/shared/ATVSLD/enums/gender.enum';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export class UpdateUserRequest {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsEnum(GenderEnum) gender?: GenderEnum;
  @IsOptional() @IsEnum(UserTypeEnum) userType?: UserTypeEnum;
  @IsOptional() @IsString() birthday?: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() province?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() ward?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsString() businessId?: string;
  @IsOptional() @IsString() avatar?: string;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isActive?: boolean;
}
