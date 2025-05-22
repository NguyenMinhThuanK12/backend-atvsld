import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PaginationQueryDto } from 'libs/shared/ATVSLD/common/pagination-query.dto';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';

export interface IDepartmentService {
  findAllPaginated(query: PaginationQueryDto): Promise<PaginatedResponse<DepartmentResponse>>
  create(data: CreateDepartmentRequest): Promise<DepartmentResponse>;
}
