import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { CreateUserRequest } from 'libs/shared/ATVSLD/models/requests/user/create-user.request';
import { SearchUserQueryRequest } from 'libs/shared/ATVSLD/models/requests/user/search-user-query.request';
import { UpdateUserRequest } from 'libs/shared/ATVSLD/models/requests/user/update-user.request';
import { UserResponse } from 'libs/shared/ATVSLD/models/response/user/user.response';

export interface IUserService {
  findById(id: string): Promise<ApiResponse<UserResponse>>;
  findAllPaginated(query: SearchUserQueryRequest): Promise<ApiResponse<PaginatedResponse<UserResponse>>>;
  createUser(dto: CreateUserRequest): Promise<ApiResponse<UserResponse>>;
  updateUser(id: string, dto: UpdateUserRequest): Promise<ApiResponse<UserResponse>>;
  deleteUser(id: string): Promise<ApiResponse<null>>;
  toggleActive(id: string, isActive: boolean): Promise<ApiResponse<UserResponse>>;
  resetPassword(id: string): Promise<ApiResponse<string>>;
  checkDuplicateEmail(email: string, excludeId?: string): Promise<ApiResponse<boolean>>;
  checkDuplicateAccount(account: string, excludeId?: string): Promise<ApiResponse<boolean>>;
}
