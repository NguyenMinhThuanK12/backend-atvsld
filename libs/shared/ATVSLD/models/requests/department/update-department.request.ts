import { IsEnum, IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { BusinessType } from '../../../enums/business-type.enum';

export class UpdateDepartmentRequest {
  @IsString()
  name: string;

  @IsDateString()
  establishedDate: Date;

  @IsEnum(BusinessType)
  businessType: BusinessType;

  @IsString()
  mainBusinessField: string;

  // Địa chỉ đăng ký
  @IsString()
  registrationCity: string;

  @IsString()
  registrationDistrict: string;

  @IsString()
  registrationWard: string;

  @IsOptional()
  @IsString()
  registrationAddress?: string;

  // Địa điểm kinh doanh thực tế
  @IsOptional()
  @IsString()
  operationCity?: string;

  @IsOptional()
  @IsString()
  operationDistrict?: string;

  @IsOptional()
  @IsString()
  operationWard?: string;

  @IsOptional()
  @IsString()
  operationAddress?: string;

  // Liên hệ
  @IsOptional()
  @IsString()
  foreignName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  representativeName?: string;

  @IsOptional()
  @IsString()
  representativePhone?: string;

  @IsBoolean()
  isActive: true;

  @IsOptional()
  @IsString()
  businessLicenseFile?: string;

  @IsOptional()
  @IsString()
  otherDocumentFile?: string;
}
