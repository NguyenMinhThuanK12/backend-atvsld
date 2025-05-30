import { Body, Controller, Get, Param, Post, Patch, Delete, Query } from '@nestjs/common';

import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { UserResponse } from 'libs/shared/ATVSLD/models/response/user/user.response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { RequirePermission } from 'libs/core/auth/require-permission.decorator';
import { PermissionConstant } from 'libs/shared/ATVSLD/common/permission';
import { CreateUserRequest } from 'libs/shared/ATVSLD/models/requests/user/create-user.request';
import { SearchUserQueryRequest } from 'libs/shared/ATVSLD/models/requests/user/search-user-query.request';
import { UpdateUserRequest } from 'libs/shared/ATVSLD/models/requests/user/update-user.request';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequirePermission(PermissionConstant.USER.VIEW)
  @Get()
  async findAll(@Query() query: SearchUserQueryRequest): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
    return this.userService.findAllPaginated(query);
  }

  @RequirePermission(PermissionConstant.USER.VIEW)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<ApiResponse<UserResponse>> {
    return this.userService.findById(id);
  }

  @RequirePermission(PermissionConstant.USER.CREATE)
  @Post()
  async create(@Body() dto: CreateUserRequest): Promise<ApiResponse<UserResponse>> {
    return this.userService.createUser(dto);
  }

  @RequirePermission(PermissionConstant.USER.UPDATE)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
    return this.userService.updateUser(id, dto);
  }

  @RequirePermission(PermissionConstant.USER.DELETE)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<null>> {
    return this.userService.deleteUser(id);
  }

  @RequirePermission(PermissionConstant.USER.UPDATE)
  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean): Promise<ApiResponse<UserResponse>> {
    return this.userService.toggleActive(id, isActive);
  }

  @RequirePermission(PermissionConstant.USER.UPDATE)
  @Patch(':id/reset-password')
  async resetPassword(@Param('id') id: string): Promise<ApiResponse<string>> {
    return this.userService.resetPassword(id);
  }
}
