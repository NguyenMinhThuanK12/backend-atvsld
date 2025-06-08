import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { IRoleRepository } from 'src/repositories/role/role.repository.interface';
import { CreateUserRequest } from 'libs/shared/ATVSLD/models/requests/user/create-user.request';
import { UpdateUserRequest } from 'libs/shared/ATVSLD/models/requests/user/update-user.request';
import { SearchUserQueryRequest } from 'libs/shared/ATVSLD/models/requests/user/search-user-query.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { UserResponse } from 'libs/shared/ATVSLD/models/response/user/user.response';
import { mapToUserEntity, mapToUserResponse } from 'libs/shared/ATVSLD/mappers/user.mapper';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import * as bcrypt from 'bcrypt';
import { IUserService } from './user.service.interface';
import { IBusinessRepository } from 'src/repositories/business/business.repository.interface';
import {
  ERROR_USER_ACCOUNT_ALREADY_EXISTS,
  ERROR_USER_EMAIL_ALREADY_EXISTS,
  ERROR_USER_PHONE_ALREADY_EXISTS,
  ERROR_USER_NOT_FOUND,
  SUCCESS_CREATE_USER,
  SUCCESS_DELETE_USER,
  SUCCESS_GET_USER_DETAIL,
  SUCCESS_GET_USER_LIST,
  SUCCESS_RESET_PASSWORD,
  SUCCESS_UPDATE_USER,
  SUCCESS_UPDATE_USER_STATUS,
  ERROR_CANNOT_ACTIVATE_USER_WHEN_BUSINESS_INACTIVE,
} from 'libs/shared/ATVSLD/constants/user-message.constant';
import { ERROR_BUSINESS_NOT_FOUND } from 'libs/shared/ATVSLD/constants/business-message.constant';
import { ERROR_ROLE_NOT_FOUND } from 'libs/shared/ATVSLD/constants/role-message.constant';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';
import { SupabaseService } from 'libs/core/supabase/supabase.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    @Inject(IRoleRepository)
    private readonly roleRepo: IRoleRepository,
    @Inject('IBusinessRepository')
    private readonly businessRepo: IBusinessRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async findById(id: string): Promise<ApiResponse<UserResponse>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_USER_NOT_FOUND), HttpStatus.NOT_FOUND);
    }
    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_USER_DETAIL, mapToUserResponse(user));
  }

  async findAllPaginated(query: SearchUserQueryRequest): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
    const { page = 1, limit = 10 } = query;
    const [users, total] = await this.userRepo.findAdvanced(query);
    const data = users.map(mapToUserResponse);

    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_USER_LIST, {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  }

  async createUser(
    dto: CreateUserRequest,
    files?: { avatar?: Express.Multer.File[] },
  ): Promise<ApiResponse<UserResponse>> {
    await this.validateDuplicate(dto.username, dto.email, dto.phoneNumber);
    await this.validateRole(dto);
    await this.validateBusiness(dto);

    // Upload avatar nếu có
    if (files?.avatar?.[0]) {
      const file = files.avatar[0];
      dto.avatar = await this.supabaseService.uploadImage(file.buffer, file.originalname);
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const entity = mapToUserEntity({ ...dto, password: hashed });
    const created = await this.userRepo.create(entity);

    const user = await this.userRepo.findById(created.id);
    return ApiResponse.success(HttpStatus.CREATED, SUCCESS_CREATE_USER, mapToUserResponse(user));
  }

  async updateUser(
    id: string,
    dto: UpdateUserRequest,
    files?: { avatar?: Express.Multer.File[] },
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_USER_NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    await this.validateDuplicate(dto.phoneNumber, id);
    await this.validateRole(dto);

    // Upload avatar mới nếu có
    if (files?.avatar?.[0]) {
      const file = files.avatar[0];
      console.log('old avatar:', user.avatar);
      dto.avatar = await this.supabaseService.uploadImage(file.buffer, file.originalname, user.avatar); // xoá ảnh cũ nếu có
    }

    const updated = await this.userRepo.update(user, dto);
    const result = await this.userRepo.findById(updated.id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_USER, mapToUserResponse(result));
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_USER_NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    await this.userRepo.delete(id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_DELETE_USER, null);
  }

  async toggleActive(id: string, isActive: boolean): Promise<ApiResponse<UserResponse>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_USER_NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    if (isActive && user.businessId) {
      const business = await this.businessRepo.findById(user.businessId);
      if (!business?.isActive) {
        throw new HttpException(
          ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_CANNOT_ACTIVATE_USER_WHEN_BUSINESS_INACTIVE),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updated = await this.userRepo.update(user, { isActive: isActive });
    const result = await this.userRepo.findById(updated.id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_USER_STATUS, mapToUserResponse(result));
  }

  async resetPassword(id: string): Promise<ApiResponse<string>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new HttpException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_USER_NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    const newPassword = 'Abcd1@34';
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(user, { password: hashed });

    return ApiResponse.success(HttpStatus.OK, SUCCESS_RESET_PASSWORD, newPassword);
  }

  private async validateDuplicate(username: string, email: string, phoneNumber?: string, excludeId?: string) {
    const checks = await Promise.all([
      this.userRepo.checkDuplicateFieldExceptId('username', username, excludeId),
      this.userRepo.checkDuplicateFieldExceptId('email', email, excludeId),
      phoneNumber
        ? this.userRepo.checkDuplicateFieldExceptId('phoneNumber', phoneNumber, excludeId)
        : Promise.resolve(false),
    ]);

    const errors: string[] = [];
    if (checks[0]) errors.push(ERROR_USER_ACCOUNT_ALREADY_EXISTS);
    if (checks[1]) errors.push(ERROR_USER_EMAIL_ALREADY_EXISTS);
    if (checks[2]) errors.push(ERROR_USER_PHONE_ALREADY_EXISTS);

    if (errors.length > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.CONFLICT, errors.join(' | ')), HttpStatus.CONFLICT);
    }
  }

  async checkDuplicateEmail(email: string, excludeId?: string): Promise<ApiResponse<boolean>> {
    const isDuplicate = await this.userRepo.checkDuplicateFieldExceptId('email', email, excludeId);
    return ApiResponse.success(HttpStatus.OK, ERROR_USER_EMAIL_ALREADY_EXISTS, isDuplicate);
  }

  async checkDuplicateAccount(username: string, excludeId?: string): Promise<ApiResponse<boolean>> {
    const isDuplicate = await this.userRepo.checkDuplicateFieldExceptId('username', username, excludeId);
    return ApiResponse.success(HttpStatus.OK, ERROR_USER_ACCOUNT_ALREADY_EXISTS, isDuplicate);
  }

  async checkDuplicatePhoneNumber(phoneNumber: string, excludeId?: string): Promise<ApiResponse<boolean>> {
    const isDuplicate = await this.userRepo.checkDuplicateFieldExceptId('phoneNumber', phoneNumber, excludeId);
    return ApiResponse.success(HttpStatus.OK, ERROR_USER_PHONE_ALREADY_EXISTS, isDuplicate);
  }

  private async validateRole(dto: CreateUserRequest | UpdateUserRequest): Promise<void> {
    const role = await this.roleRepo.findById(dto.roleId);
    if (!role) {
      throw new HttpException(ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_ROLE_NOT_FOUND), HttpStatus.BAD_REQUEST);
    }
  }

  private async validateBusiness(dto: CreateUserRequest): Promise<void> {
    if (dto.userType === UserTypeEnum.BUSINESS) {
      const business = await this.businessRepo.findById(dto.businessId);
      if (!business) {
        throw new HttpException(
          ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_BUSINESS_NOT_FOUND),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
