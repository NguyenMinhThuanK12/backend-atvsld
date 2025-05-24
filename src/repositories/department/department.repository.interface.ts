import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';
import { UpdateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department.request';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';
import { Department } from 'src/entities/department.entity';

export const IDepartmentRepository = 'IDepartmentRepository';

export interface IDepartmentRepository {
  findPaginated(page: number, limit: number): Promise<[DepartmentResponse[], number]>;
  findById(id: number): Promise<Department | null>;
  findAdvanced(query: SearchDepartmentQueryRequest): Promise<[DepartmentResponse[], number]>;

  isTaxCodeExisted(taxCode: string): Promise<boolean>;
  isEmailExisted(email: string): Promise<boolean>;
  isNameExisted(name: string): Promise<boolean>;
  isPhoneNumberExisted(phoneNumber: string): Promise<boolean>;
  isForeignNameExisted(foreignName: string): Promise<boolean>;
  isRepresentativePhoneExisted(phone: string): Promise<boolean>;

  isEmailExistedExceptId(email: string, id: number): Promise<boolean>;
  isNameExistedExceptId(name: string, id: number): Promise<boolean>;
  isPhoneNumberExistedExceptId(phone: string, id: number): Promise<boolean>;
  isForeignNameExistedExceptId(name: string, id: number): Promise<boolean>;
  isRepresentativePhoneExistedExceptId(phone: string, id: number): Promise<boolean>;

  create(data: Department): Promise<Department>;
  update(target: Department, data: UpdateDepartmentRequest): Promise<Department>;
  delete(id: number): Promise<void>;
}
