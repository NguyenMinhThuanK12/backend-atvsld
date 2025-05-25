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
  SUCCESS_UPDATE_DEPARTMENT_STATUS,
} from 'libs/shared/ATVSLD/constants/department-message.constant';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { ERROR_NO_DATA } from 'libs/shared/ATVSLD/constants/system.constant';
import { mapToDepartmentEntity, mapToDepartmentResponse } from 'libs/shared/ATVSLD/mappers/department.mapper';
import { UpdateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department.request';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';
import { PdfGeneratorService } from 'libs/core/pdf/pdf-generator.service';
import { PdfTemplate } from 'libs/core/pdf/pdf-template.interface';
import { Department } from 'src/entities/department.entity';

@Injectable()
export class DepartmentService implements IDepartmentService {
  constructor(
    @Inject(IDepartmentRepository)
    private readonly deptRepo: IDepartmentRepository,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  async findAllPaginated(query: PaginationQueryRequest): Promise<ApiResponse<PaginatedResponse<DepartmentResponse>>> {
    const { page = 1, limit = 10 } = query;
    const [items, total] = await this.deptRepo.findPaginated(page, limit);
    const data = items.map(mapToDepartmentResponse);

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

  async findAdvanced(query: SearchDepartmentQueryRequest): Promise<ApiResponse<PaginatedResponse<DepartmentResponse>>> {
    const [items, total] = await this.deptRepo.findAdvanced(query);
    const data = items.map(mapToDepartmentResponse);

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

  async create(data: CreateDepartmentRequest): Promise<ApiResponse<DepartmentResponse>> {
    await this.validateAddInput(data);
    const entity = mapToDepartmentEntity(data);
    const saved = await this.deptRepo.create(entity);
    const result = mapToDepartmentResponse(saved);
    return ApiResponse.success<DepartmentResponse>(HttpStatus.CREATED, SUCCESS_CREATE_DEPARTMENT, result);
  }

  async updateStatus(id: number, isActive: boolean): Promise<ApiResponse<DepartmentResponse>> {
    const dept = await this.deptRepo.findById(id);
    if (!dept) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_DEPARTMENT_NOT_FOUND));
    }

    const updated = await this.deptRepo.updateStatus(id, isActive);
    const result = mapToDepartmentResponse(updated);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_DEPARTMENT_STATUS, result);
  }

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

  async delete(id: number): Promise<ApiResponse<null>> {
    const department = await this.deptRepo.findById(id);
    if (!department) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_DEPARTMENT_NOT_FOUND));
    }

    await this.deptRepo.delete(id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_DELETE_DEPARTMENT, null);
  }

  async exportPdf(ids: number[]): Promise<Buffer> {
    if (!ids || ids.length === 0) {
      throw new HttpException('Vui lòng chọn ít nhất 1 bản ghi', HttpStatus.BAD_REQUEST);
    }
  
    const departments = await this.deptRepo.findByIds(ids);
  
    const template: PdfTemplate<Department> = {
      title: 'Danh sách doanh nghiệp',
      columns: ['STT', 'Tên doanh nghiệp', 'Mã số thuế', 'Tỉnh', 'Trạng thái'],
      mapper: (dept, idx) => [
        (idx + 1).toString(),
        dept.name,
        dept.taxCode,
        dept.registrationCity,
        dept.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động',
      ],
    };
  
    return this.pdfGenerator.generatePdf(departments, template);
  }

  private async validateAddInput(data: CreateDepartmentRequest): Promise<void> {
    const errors: string[] = [];

    const checks = await Promise.all([
      this.deptRepo.checkDuplicateField('taxCode', data.taxCode),
      this.deptRepo.checkDuplicateField('email', data.email),
      this.deptRepo.checkDuplicateField('name', data.name),
      this.deptRepo.checkDuplicateField('phoneNumber', data.phoneNumber),
      this.deptRepo.checkDuplicateField('foreignName', data.foreignName),
      this.deptRepo.checkDuplicateField('representativePhone', data.representativePhone),
    ]);

    if (checks[0]) errors.push(ERROR_TAXCODE_ALREADY_EXISTS);
    if (checks[1]) errors.push(ERROR_EMAIL_ALREADY_EXISTS);
    if (checks[2]) errors.push(ERROR_NAME_ALREADY_EXISTS);
    if (checks[3]) errors.push(ERROR_PHONE_ALREADY_EXISTS);
    if (checks[4]) errors.push(ERROR_FOREIGN_NAME_ALREADY_EXISTS);
    if (checks[5]) errors.push(ERROR_REPRESENTATIVE_PHONE_ALREADY_EXISTS);

    if (errors.length > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.CONFLICT, errors.join(' | ')), HttpStatus.CONFLICT);
    }
  }

  private async validateUpdateInput(id: number, data: UpdateDepartmentRequest): Promise<void> {
    const errors: string[] = [];

    const checks = await Promise.all([
      this.deptRepo.checkDuplicateFieldExceptId('email', data.email, id),
      this.deptRepo.checkDuplicateFieldExceptId('name', data.name, id),
      this.deptRepo.checkDuplicateFieldExceptId('phoneNumber', data.phoneNumber, id),
      this.deptRepo.checkDuplicateFieldExceptId('foreignName', data.foreignName, id),
      this.deptRepo.checkDuplicateFieldExceptId('representativePhone', data.representativePhone, id),
    ]);

    if (checks[0]) errors.push(ERROR_EMAIL_ALREADY_EXISTS);
    if (checks[1]) errors.push(ERROR_NAME_ALREADY_EXISTS);
    if (checks[2]) errors.push(ERROR_PHONE_ALREADY_EXISTS);
    if (checks[3]) errors.push(ERROR_FOREIGN_NAME_ALREADY_EXISTS);
    if (checks[4]) errors.push(ERROR_REPRESENTATIVE_PHONE_ALREADY_EXISTS);

    if (errors.length > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.CONFLICT, errors.join(' | ')), HttpStatus.CONFLICT);
    }
  }
}
