import { Business } from 'src/entities/business.entity';
import { BusinessResponse } from '../models/response/business/business.response';
import { CreateBusinessRequest } from '../models/requests/business/create-business.request';

export const mapToBusinessResponse = (d: Business): BusinessResponse => ({
  id: d.id,
  name: d.name,
  taxCode: d.taxCode,
  establishedDate: d.establishedDate,
  businessType: d.businessType,
  mainBusinessField: d.mainBusinessField,

  registrationCity: d.registrationCity,
  registrationDistrict: d.registrationDistrict,
  registrationWard: d.registrationWard,
  registrationAddress: d.registrationAddress,

  operationCity: d.operationCity,
  operationDistrict: d.operationDistrict,
  operationWard: d.operationWard,
  operationAddress: d.operationAddress,

  foreignName: d.foreignName,
  email: d.email,
  phoneNumber: d.phoneNumber,

  representativeName: d.representativeName,
  representativePhone: d.representativePhone,

  businessLicenseFile: d.businessLicenseFile,
  otherDocumentFile: d.otherDocumentFile,
  isActive: d.isActive,
});

export const mapToBusinessEntity = (req: CreateBusinessRequest): Business => {
  const entity = new Business();

  entity.name = req.name;
  entity.taxCode = req.taxCode;
  entity.establishedDate = req.establishedDate;
  entity.businessType = req.businessType;
  entity.mainBusinessField = req.mainBusinessField;

  entity.registrationCity = req.registrationCity;
  entity.registrationDistrict = req.registrationDistrict;
  entity.registrationWard = req.registrationWard;
  entity.registrationAddress = req.registrationAddress ?? null;

  entity.operationCity = req.operationCity ?? null;
  entity.operationDistrict = req.operationDistrict ?? null;
  entity.operationWard = req.operationWard ?? null;
  entity.operationAddress = req.operationAddress ?? null;

  entity.foreignName = req.foreignName ?? null;
  entity.email = req.email ?? null;
  entity.phoneNumber = req.phoneNumber ?? null;

  entity.representativeName = req.representativeName ?? null;
  entity.representativePhone = req.representativePhone ?? null;

  entity.businessLicenseFile = req.businessLicenseFile ?? null;
  entity.otherDocumentFile = req.otherDocumentFile ?? null;

  entity.isActive = true; // mặc định khi tạo là active

  return entity;
};
