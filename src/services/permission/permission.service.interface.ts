import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { SearchPermissionComponentRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-component.request';
import { SearchPermissionGroupRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-group.request';
import { PermissionResponse } from 'libs/shared/ATVSLD/models/response/permission/permission.response';

export interface IPermissionService {
  getGroupPermissions(query: SearchPermissionGroupRequest): Promise<ApiResponse<PaginatedResponse<PermissionResponse>>>;
  getComponentPermissionsByGroup(query: SearchPermissionComponentRequest): Promise<ApiResponse<PermissionResponse[]>>;
}
