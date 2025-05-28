import { Inject, Injectable } from '@nestjs/common';
import {
  IPermissionRepository,
  IPermissionRepository as IPermissionRepoToken,
} from 'src/repositories/permission/permission.repository.interface';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { mapToPermissionResponse } from 'libs/shared/ATVSLD/mappers/permission.mapper';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { SUCCESS_GET_PERMISSION_GROUPED } from 'libs/shared/ATVSLD/constants/permission-message.constant';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PermissionResponse } from 'libs/shared/ATVSLD/models/response/permission/permission.response';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(IPermissionRepoToken)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async getGroupPermissions(query: PaginationQueryRequest) {
    const [items, total] = await this.permissionRepo.findGroupPaginated(query.page, query.limit);
    const data = items.map((item) => mapToPermissionResponse(item));

    const response: PaginatedResponse<PermissionResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: query.limit,
        totalPages: Math.ceil(total / query.limit),
        currentPage: query.page,
      },
    };

    return ApiResponse.success(200, SUCCESS_GET_PERMISSION_GROUPED, response);
  }
  async getComponentPermissionsByGroup(parentCode: string) {
    const items = await this.permissionRepo.findComponentsByParentCode(parentCode);
    const data = items.map(mapToPermissionResponse);

    return ApiResponse.success(200, SUCCESS_GET_PERMISSION_GROUPED, data);
  }
}
