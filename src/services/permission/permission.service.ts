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

  async getGroupPermissions(query: PaginationQueryRequest & { code?: string; name?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const [items, total] = await this.permissionRepo.findGroupPaginated(page, limit, query.code, query.name);
    const data = items.map((item) => mapToPermissionResponse(item));

    const response: PaginatedResponse<PermissionResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
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
