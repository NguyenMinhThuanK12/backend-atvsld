import { BusinessType } from '../../../enums/business-type.enum';

export interface BusinessResponse {
  id: number;
  name: string;
  taxCode: string;
  establishedDate: Date;
  businessType: BusinessType;
  mainBusinessField: string;

  registrationCity: string;
  registrationDistrict: string;
  registrationWard: string;
  registrationAddress: string | null;

  operationCity: string | null;
  operationDistrict: string | null;
  operationWard: string | null;
  operationAddress: string | null;

  foreignName: string | null;
  email: string | null;
  phoneNumber: string | null;

  representativeName: string | null;
  representativePhone: string | null;

  isActive: boolean;
  businessLicenseFile: string | null;
  otherDocumentFile: string | null;
}
