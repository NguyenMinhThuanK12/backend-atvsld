import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';
import { UpdateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department.request';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';

export interface IDepartmentService {
  findAllPaginated(query: PaginationQueryRequest): Promise<ApiResponse<PaginatedResponse<DepartmentResponse>>>;
  findAdvanced(query: SearchDepartmentQueryRequest): Promise<ApiResponse<PaginatedResponse<DepartmentResponse>>>;
  create(data: CreateDepartmentRequest): Promise<ApiResponse<DepartmentResponse>>;
  update(id: number, data: UpdateDepartmentRequest): Promise<ApiResponse<DepartmentResponse>>;
  updateStatus(id: number, isActive: boolean): Promise<ApiResponse<DepartmentResponse>>;
  delete(id: number): Promise<ApiResponse<null>>;
}
