import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { CreateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/create-role.request';
import { UpdateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/update-role.request';
import { SearchRoleQueryRequest } from 'libs/shared/ATVSLD/models/requests/role/search-role-query.request';
import { RoleResponse } from 'libs/shared/ATVSLD/models/response/role/role.response';

export interface IRoleService {
  findById(id: string): Promise<ApiResponse<RoleResponse>>;
  getPaginatedRoles(query: PaginationQueryRequest): Promise<ApiResponse<PaginatedResponse<RoleResponse>>>;
  findAdvanced(query: SearchRoleQueryRequest): Promise<ApiResponse<PaginatedResponse<RoleResponse>>>;
  createRole(dto: CreateRoleRequest): Promise<ApiResponse<RoleResponse>>;
  updateRole(id: string, dto: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>>;
  deleteRole(id: string): Promise<ApiResponse<null>>;
}
