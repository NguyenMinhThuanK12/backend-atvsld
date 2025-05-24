import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDepartmentRepository } from 'src/repositories/department/department.repository.interface';
import { IDepartmentService } from './department.service.interface';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';

import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import {
  ERROR_DEPARTMENT_NOT_FOUND,
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_FOREIGN_NAME_ALREADY_EXISTS,
  ERROR_NAME_ALREADY_EXISTS,
  ERROR_PHONE_ALREADY_EXISTS,
  ERROR_REPRESENTATIVE_PHONE_ALREADY_EXISTS,
  ERROR_TAXCODE_ALREADY_EXISTS,
  SUCCESS_CREATE_DEPARTMENT,
  SUCCESS_DELETE_DEPARTMENT,
  SUCCESS_GET_DEPARTMENT_LIST,
  SUCCESS_UPDATE_DEPARTMENT,
} from 'libs/shared/ATVSLD/constants/department-message.constant';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { ERROR_NO_DATA } from 'libs/shared/ATVSLD/constants/system.constant';
import { mapToDepartmentEntity, mapToDepartmentResponse } from 'libs/shared/ATVSLD/mappers/department.mapper';
import { UpdateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department.request';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';

@Injectable()
export class DepartmentService implements IDepartmentService {
  constructor(
    @Inject(IDepartmentRepository)
    private readonly deptRepo: IDepartmentRepository,
  ) {}

  // lấy tất cả
  async findAllPaginated(query: PaginationQueryRequest): Promise<ApiResponse<PaginatedResponse<DepartmentResponse>>> {
    const { page = 1, limit = 10 } = query;
    const [data, total] = await this.deptRepo.findPaginated(page, limit);

    const response: PaginatedResponse<DepartmentResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };

    const message = data.length === 0 ? ERROR_NO_DATA : SUCCESS_GET_DEPARTMENT_LIST;

    return ApiResponse.success(HttpStatus.OK, message, response);
  }

  // Tìm kiếm 1 hoặc nhiều điều kiện
  async findAdvanced(query: SearchDepartmentQueryRequest): Promise<ApiResponse<PaginatedResponse<DepartmentResponse>>> {
    const [data, total] = await this.deptRepo.findAdvanced(query);

    const response: PaginatedResponse<DepartmentResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: query.limit,
        totalPages: Math.ceil(total / query.limit),
        currentPage: query.page,
      },
    };
    const message = data.length === 0 ? ERROR_NO_DATA : SUCCESS_GET_DEPARTMENT_LIST;
    return ApiResponse.success(HttpStatus.OK, message, response);
  }

  // Thêm
  async create(data: CreateDepartmentRequest): Promise<ApiResponse<DepartmentResponse>> {
    await this.validateAddInput(data);
    const entity = mapToDepartmentEntity(data);
    const saved = await this.deptRepo.create(entity);
    const result = mapToDepartmentResponse(saved);
    return ApiResponse.success<DepartmentResponse>(HttpStatus.CREATED, SUCCESS_CREATE_DEPARTMENT, result);
  }

  // Cập nhật
  async update(id: number, data: UpdateDepartmentRequest): Promise<ApiResponse<DepartmentResponse>> {
    const department = await this.deptRepo.findById(id);

    if (!department) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_DEPARTMENT_NOT_FOUND));
    }

    await this.validateUpdateInput(id, data);

    const updatedEntity = await this.deptRepo.update(department, data);
    const result = mapToDepartmentResponse(updatedEntity);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_DEPARTMENT, result);
  }

  // Xóa
  async delete(id: number): Promise<ApiResponse<null>> {
    const department = await this.deptRepo.findById(id);

    if (!department) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_DEPARTMENT_NOT_FOUND));
    }

    await this.deptRepo.delete(id);

    return ApiResponse.success(HttpStatus.OK, SUCCESS_DELETE_DEPARTMENT, null);
  }

  // Kiểm tra đầu vào khi thêm
  private async validateAddInput(data: CreateDepartmentRequest): Promise<void> {
    const errors: string[] = [];

    const [isTaxCodeDup, isEmailDup, isNameDup, isPhoneDup, isForeignNameDup, isRepPhoneDup] = await Promise.all([
      this.deptRepo.isTaxCodeExisted(data.taxCode),
      this.deptRepo.isEmailExisted(data.email),
      this.deptRepo.isNameExisted(data.name),
      this.deptRepo.isPhoneNumberExisted(data.phoneNumber),
      this.deptRepo.isForeignNameExisted(data.foreignName),
      this.deptRepo.isRepresentativePhoneExisted(data.representativePhone),
    ]);

    if (isTaxCodeDup) errors.push(ERROR_TAXCODE_ALREADY_EXISTS);
    if (isEmailDup) errors.push(ERROR_EMAIL_ALREADY_EXISTS);
    if (isNameDup) errors.push(ERROR_NAME_ALREADY_EXISTS);
    if (isPhoneDup) errors.push(ERROR_PHONE_ALREADY_EXISTS);
    if (isForeignNameDup) errors.push(ERROR_FOREIGN_NAME_ALREADY_EXISTS);
    if (isRepPhoneDup) errors.push(ERROR_REPRESENTATIVE_PHONE_ALREADY_EXISTS);

    if (errors.length > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.CONFLICT, errors.join(' | ')), HttpStatus.CONFLICT);
    }
  }

  //Kiểm tra đầu vào khi cập nhật
  private async validateUpdateInput(id: number, data: UpdateDepartmentRequest): Promise<void> {
    const errors: string[] = [];

    const [isEmailDup, isNameDup, isPhoneDup, isForeignNameDup, isRepPhoneDup] = await Promise.all([
      this.deptRepo.isEmailExistedExceptId(data.email, id),
      this.deptRepo.isNameExistedExceptId(data.name, id),
      this.deptRepo.isPhoneNumberExistedExceptId(data.phoneNumber, id),
      this.deptRepo.isForeignNameExistedExceptId(data.foreignName, id),
      this.deptRepo.isRepresentativePhoneExistedExceptId(data.representativePhone, id),
    ]);

    if (isEmailDup) errors.push(ERROR_EMAIL_ALREADY_EXISTS);
    if (isNameDup) errors.push(ERROR_NAME_ALREADY_EXISTS);
    if (isPhoneDup) errors.push(ERROR_PHONE_ALREADY_EXISTS);
    if (isForeignNameDup) errors.push(ERROR_FOREIGN_NAME_ALREADY_EXISTS);
    if (isRepPhoneDup) errors.push(ERROR_REPRESENTATIVE_PHONE_ALREADY_EXISTS);

    if (errors.length > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.CONFLICT, errors.join(' | ')), HttpStatus.CONFLICT);
    }
  }
}
