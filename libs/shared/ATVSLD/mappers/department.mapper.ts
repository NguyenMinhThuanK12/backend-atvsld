import { Department } from 'src/entities/department.entity';
import { DepartmentResponse } from '../models/response/department/department.response';
import { CreateDepartmentRequest } from '../models/requests/department/create-department.request';
import { UpdateDepartmentRequest } from '../models/requests/department/update-department.request';

export const mapToDepartmentResponse = (d: Department): DepartmentResponse => ({
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

export const mapToDepartmentEntity = (
  req: CreateDepartmentRequest,
): Department => {
  const entity = new Department();

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

export const mapToUpdatedDepartmentEntity = (
  entity: Department,
  req: UpdateDepartmentRequest,
): Department => {
  entity.name = req.name ?? entity.name;
  entity.establishedDate = req.establishedDate ?? entity.establishedDate;
  entity.businessType = req.businessType ?? entity.businessType;
  entity.mainBusinessField = req.mainBusinessField ?? entity.mainBusinessField;

  entity.registrationCity = req.registrationCity ?? entity.registrationCity;
  entity.registrationDistrict =
    req.registrationDistrict ?? entity.registrationDistrict;
  entity.registrationWard = req.registrationWard ?? entity.registrationWard;
  entity.registrationAddress =
    req.registrationAddress ?? entity.registrationAddress;

  entity.operationCity = req.operationCity ?? entity.operationCity;
  entity.operationDistrict = req.operationDistrict ?? entity.operationDistrict;
  entity.operationWard = req.operationWard ?? entity.operationWard;
  entity.operationAddress = req.operationAddress ?? entity.operationAddress;

  entity.foreignName = req.foreignName ?? entity.foreignName;
  entity.email = req.email ?? entity.email;
  entity.phoneNumber = req.phoneNumber ?? entity.phoneNumber;

  entity.representativeName =
    req.representativeName ?? entity.representativeName;
  entity.representativePhone =
    req.representativePhone ?? entity.representativePhone;

  entity.businessLicenseFile =
    req.businessLicenseFile ?? entity.businessLicenseFile;
  entity.otherDocumentFile = req.otherDocumentFile ?? entity.otherDocumentFile;

  if (req.isActive !== undefined) {
    entity.isActive = req.isActive;
  }

  return entity;
};
