import { IBaseRepository } from 'libs/core/base/base.repository.interface';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';
import { Department } from 'src/entities/department.entity';

export const IDepartmentRepository = 'IDepartmentRepository';

export interface IDepartmentRepository  extends IBaseRepository<Department>{
  findAdvanced(query: SearchDepartmentQueryRequest): Promise<[Department[], number]> ;
}
