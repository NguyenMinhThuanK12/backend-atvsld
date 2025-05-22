import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IDepartmentRepository } from 'src/repositories/department/department.repository.interface';
import { IDepartmentService } from './department.service.interface';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';

import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import {
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_TAXCODE_ALREADY_EXISTS,
  SUCCESS_CREATE_DEPARTMENT,
  SUCCESS_GET_DEPARTMENT_LIST,
} from 'libs/shared/ATVSLD/constants/department-message.constant';
import { PaginationQueryDto } from 'libs/shared/ATVSLD/common/pagination-query.dto';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { ERROR_NO_DATA } from 'libs/shared/ATVSLD/constants/system.constant';

@Injectable()
export class DepartmentService implements IDepartmentService {
  constructor(
    @Inject(IDepartmentRepository)
    private readonly deptRepo: IDepartmentRepository,
  ) {}

  async findAllPaginated(query: PaginationQueryDto): Promise<any> {
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

    const message =
      data.length === 0 ? ERROR_NO_DATA : SUCCESS_GET_DEPARTMENT_LIST;

    return ApiResponse.success(HttpStatus.OK, message, response);
  }

  async create(data: CreateDepartmentRequest): Promise<any> {
    await this.validateInput(data);

    const department = await this.deptRepo.create(data);
    return ApiResponse.success<DepartmentResponse>(
      HttpStatus.CREATED,
      SUCCESS_CREATE_DEPARTMENT,
      department,
    );
  }

  private async validateInput(data: CreateDepartmentRequest): Promise<void> {
    const [isTaxCodeDup, isEmailDup] = await Promise.all([
      this.deptRepo.isTaxCodeExisted(data.taxCode),
      this.deptRepo.isEmailExisted(data.email),
    ]);

    if (isTaxCodeDup) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.CONFLICT, ERROR_TAXCODE_ALREADY_EXISTS),
        HttpStatus.CONFLICT,
      );
    }

    if (isEmailDup) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.CONFLICT, ERROR_EMAIL_ALREADY_EXISTS),
        HttpStatus.CONFLICT,
      );
    }
  }
}
