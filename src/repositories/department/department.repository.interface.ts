import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';

export const IDepartmentRepository = 'IDepartmentRepository';

export interface IDepartmentRepository {
  findPaginated(page: number, limit: number): Promise<[DepartmentResponse[], number]> 
  isTaxCodeExisted(taxCode: string): Promise<boolean>
  isEmailExisted(email: string): Promise<boolean>
  create(data: CreateDepartmentRequest): Promise<DepartmentResponse>;
}
