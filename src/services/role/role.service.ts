import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from 'src/repositories/role/role.repository.interface';
import { CreateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/create-role.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import {
  ERROR_PERMISSION_NOT_FOUND,
  ERROR_ROLE_CODE_ALREADY_EXISTS,
  ERROR_ROLE_IN_USE,
  ERROR_ROLE_NAME_ALREADY_EXISTS,
  ERROR_ROLE_NOT_FOUND,
  SUCCESS_CREATE_ROLE,
  SUCCESS_DELETE_ROLE,
  SUCCESS_GET_ROLE_DETAIL,
  SUCCESS_GET_ROLE_LIST,
  SUCCESS_UPDATE_ROLE,
} from 'libs/shared/ATVSLD/constants/role-message.constant';
import { mapToRoleEntity, mapToRoleResponse } from 'libs/shared/ATVSLD/mappers/role.mapper';
import { RoleResponse } from 'libs/shared/ATVSLD/models/response/role/role.response';
import { UpdateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/update-role.request';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { SearchRoleQueryRequest } from 'libs/shared/ATVSLD/models/requests/role/search-role-query.request';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { ERROR_PERMISSION_NOT_FOUND_BY_ID } from 'libs/shared/ATVSLD/constants/permission-message.constant';
import { IRoleService } from './role.service.interface';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject(IRoleRepository)
    private readonly roleRepo: IRoleRepository,

    @Inject(IPermissionRepository)
    private readonly permissionRepo: IPermissionRepository,

    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
  ) {}

  async createRole(dto: CreateRoleRequest): Promise<ApiResponse<RoleResponse>> {
    // Kiểm tra trùng code role
    const isDuplicate = await this.roleRepo.checkDuplicateField('code', dto.code);
    if (isDuplicate) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.CONFLICT, ERROR_ROLE_CODE_ALREADY_EXISTS),
        HttpStatus.CONFLICT,
      );
    }

    //  Kiểm tra permissionIds tồn tại hợp lệ
    if (dto.permissionIds?.length) {
      const existing = await this.permissionRepo.findByIds(dto.permissionIds);
      if (existing.length !== dto.permissionIds.length) {
        throw new HttpException(
          ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_PERMISSION_NOT_FOUND_BY_ID),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //  Tạo role
    const entity = mapToRoleEntity(dto);
    const role = await this.roleRepo.create(entity);

    // Gán quyền
    await this.roleRepo.assignPermissions(role.id, dto.permissionIds);
    //  Load lại để có rolePermissions
    const loadedRole = await this.roleRepo.findById(role.id);

    return ApiResponse.success(HttpStatus.CREATED, SUCCESS_CREATE_ROLE, mapToRoleResponse(loadedRole));
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>> {
    const role = await this.roleRepo.findById(id);
    if (!role) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_ROLE_NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    const isDuplicate = await this.roleRepo.checkDuplicateFieldExceptId('name', data.name, id);
    if (isDuplicate) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.CONFLICT, ERROR_ROLE_NAME_ALREADY_EXISTS),
        HttpStatus.CONFLICT,
      );
    }

    if (data.permissionIds?.length) {
      const existing = await this.permissionRepo.findByIds(data.permissionIds);
      if (existing.length !== data.permissionIds.length) {
        throw new HttpException(
          ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_PERMISSION_NOT_FOUND),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Gán quyền
    await this.roleRepo.assignPermissions(id, data.permissionIds);
    const updated = await this.roleRepo.update(role, data);
    const result = mapToRoleResponse(updated);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_ROLE, result);
  }

  async deleteRole(id: string): Promise<ApiResponse<null>> {
    const role = await this.roleRepo.findById(id);
    if (!role) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_ROLE_NOT_FOUND), HttpStatus.NOT_FOUND);
    }
    const usersUsingRole = await this.userRepo.count({ where: { role: { id } } });
    if (usersUsingRole > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_ROLE_IN_USE), HttpStatus.BAD_REQUEST);
    }
    // Xóa quyền liên kết trước
    await this.roleRepo.clearPermissions(id);

    // Sau đó mới xóa vai trò
    await this.roleRepo.delete(id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_DELETE_ROLE, null);
  }

  async getPaginatedRoles(query: PaginationQueryRequest): Promise<ApiResponse<PaginatedResponse<RoleResponse>>> {
    const { page = 1, limit = 10 } = query;
    const [items, total] = await this.roleRepo.findPaginated(page, limit);
    const data = items.map(mapToRoleResponse);

    const response: PaginatedResponse<RoleResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };

    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_ROLE_LIST, response);
  }

  async findById(id: string): Promise<ApiResponse<RoleResponse>> {
    const role = await this.roleRepo.findById(id);
    if (!role) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_ROLE_NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_ROLE_DETAIL, mapToRoleResponse(role));
  }

  async findAdvanced(query: SearchRoleQueryRequest): Promise<ApiResponse<PaginatedResponse<RoleResponse>>> {
    const [items, total] = await this.roleRepo.findAdvanced(query);
    const data = items.map(mapToRoleResponse);

    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_ROLE_LIST, {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: query.limit,
        totalPages: Math.ceil(total / query.limit),
        currentPage: query.page,
      },
    });
  }

  async checkDuplicateCode(code: string, excludeId?: string): Promise<ApiResponse<boolean>> {
    const isDuplicate = await this.roleRepo.checkDuplicateFieldExceptId('code', code, excludeId);
    return ApiResponse.success(HttpStatus.OK, ERROR_ROLE_CODE_ALREADY_EXISTS, isDuplicate);
  }
}
