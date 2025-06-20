import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBusinessRepository } from 'src/repositories/business/business.repository.interface';
import { IBusinessService } from './business.service.interface';
import { BusinessResponse } from 'libs/shared/ATVSLD/models/response/business/business.response';
import { CreateBusinessRequest } from 'libs/shared/ATVSLD/models/requests/business/create-business.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import {
  ERROR_BUSINESS_NOT_FOUND,
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_NAME_ALREADY_EXISTS,
  ERROR_TAXCODE_ALREADY_EXISTS,
  SUCCESS_CREATE_BUSINESS,
  SUCCESS_DELETE_BUSINESS,
  SUCCESS_GET_ACTIVE_BUSINESS_LIST,
  SUCCESS_GET_BUSINESS_LIST,
  SUCCESS_UPDATE_BUSINESS,
  SUCCESS_UPDATE_BUSINESS_STATUS,
} from 'libs/shared/ATVSLD/constants/business-message.constant';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { ERROR_NO_DATA } from 'libs/shared/ATVSLD/constants/system.constant';
import { mapToBusinessEntity, mapToBusinessResponse } from 'libs/shared/ATVSLD/mappers/business.mapper';
import { UpdateBusinessRequest } from 'libs/shared/ATVSLD/models/requests/business/update-business.request';
import { SearchBusinessQueryRequest } from 'libs/shared/ATVSLD/models/requests/business/search-business-query.request';
import { PdfGeneratorService } from 'libs/core/pdf/pdf-generator.service';
import { PdfTemplate } from 'libs/core/pdf/pdf-template.interface';
import { Business } from 'src/entities/business.entity';
import { SupabaseService } from 'libs/core/supabase/supabase.service';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { ReportConfiguration } from 'src/entities/report-configuration.entity';
import { ReportInstance } from 'src/entities/report-instance.entity';
import { ReportDetail } from 'src/entities/report-detail.entity';
import { ReportStatusEnum } from 'libs/shared/ATVSLD/enums/report-status.enum';
import { DataSource, MoreThan } from 'typeorm';
@Injectable()
export class BusinessService implements IBusinessService {
  constructor(
    @Inject(IBusinessRepository)
    private readonly businessRepo: IBusinessRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly supabaseService: SupabaseService,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<ApiResponse<BusinessResponse>> {
    const business = await this.businessRepo.findById(id);
    if (!business) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_BUSINESS_NOT_FOUND));
    }

    const result = mapToBusinessResponse(business);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_BUSINESS_LIST, result);
  }

  async findAllPaginated(query: PaginationQueryRequest): Promise<ApiResponse<PaginatedResponse<BusinessResponse>>> {
    const { page = 1, limit = 10 } = query;
    const [items, total] = await this.businessRepo.findPaginated(page, limit);
    const data = items.map(mapToBusinessResponse);

    const response: PaginatedResponse<BusinessResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };

    const message = data.length === 0 ? ERROR_NO_DATA : SUCCESS_GET_BUSINESS_LIST;
    return ApiResponse.success(HttpStatus.OK, message, response);
  }

  async findAdvanced(query: SearchBusinessQueryRequest): Promise<ApiResponse<PaginatedResponse<BusinessResponse>>> {
    const [items, total] = await this.businessRepo.findAdvanced(query);
    const data = items.map(mapToBusinessResponse);

    const response: PaginatedResponse<BusinessResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: query.limit,
        totalPages: Math.ceil(total / query.limit),
        currentPage: query.page,
      },
    };

    const message = data.length === 0 ? ERROR_NO_DATA : SUCCESS_GET_BUSINESS_LIST;
    return ApiResponse.success(HttpStatus.OK, message, response);
  }

  async findActive(): Promise<ApiResponse<BusinessResponse[]>> {
    const businesses = await this.businessRepo.findActive();
    const data = businesses.map(mapToBusinessResponse);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_ACTIVE_BUSINESS_LIST, data);
  }

  async create(
    data: CreateBusinessRequest,
    files?: {
      businessLicense?: Express.Multer.File[];
      otherDocument?: Express.Multer.File[];
    },
  ): Promise<ApiResponse<BusinessResponse>> {
    await this.validateAddInput(data);

    // Chỉ upload lên supbase nếu validate thành công
    if (files?.businessLicense?.[0]) {
      const file = files.businessLicense[0];
      data.businessLicenseFile = await this.supabaseService.uploadPdf(file.buffer, file.originalname);
    }

    if (files?.otherDocument?.[0]) {
      const file = files.otherDocument[0];
      data.otherDocumentFile = await this.supabaseService.uploadPdf(file.buffer, file.originalname);
    }

    const entity = mapToBusinessEntity(data);
    const saved = await this.businessRepo.create(entity);

    const now = new Date();

    // Lấy tất cả cấu hình chưa quá hạn
    const configRepo = this.dataSource.getRepository(ReportConfiguration);
    const instanceRepo = this.dataSource.getRepository(ReportInstance);
    const detailRepo = this.dataSource.getRepository(ReportDetail);

    const configs = await configRepo.find({
      where: {
        isOverdue: false,
        endDate: MoreThan(now), // chưa hết hạn
      },
    });

    // Tạo report-instance và detail tương ứng
    const instances: ReportInstance[] = configs.map((config) => {
      const instance = new ReportInstance();
      instance.configId = config.id;
      instance.businessId = saved.id; // doanh nghiệp mới
      instance.status = ReportStatusEnum.PENDING;
      return instance;
    });

    const savedInstances = await instanceRepo.save(instances);

    const details = savedInstances.map((instance) => {
      const detail = new ReportDetail();
      detail.instanceId = instance.id;
      return detail;
    });
    await detailRepo.save(details);
    const result = mapToBusinessResponse(saved);
    return ApiResponse.success<BusinessResponse>(HttpStatus.CREATED, SUCCESS_CREATE_BUSINESS, result);
  }

  async updateStatus(id: string, isActive: boolean): Promise<ApiResponse<BusinessResponse>> {
    const business = await this.businessRepo.findById(id);
    if (!business) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_BUSINESS_NOT_FOUND));
    }
    if (!isActive) {
      await this.userRepo.deactivateAllUsersByBusiness(id); // Tắt toàn bộ user
    } else {
      await this.userRepo.activateAllUsersByBusiness(id); // Bật lại toàn bộ user
    }
    const updated = await this.businessRepo.updateStatus(id, isActive);
    const result = mapToBusinessResponse(updated);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_BUSINESS_STATUS, result);
  }

  async update(
    id: string,
    data: UpdateBusinessRequest,
    files?: {
      businessLicense?: Express.Multer.File[];
      otherDocument?: Express.Multer.File[];
    },
  ): Promise<ApiResponse<BusinessResponse>> {
    const business = await this.businessRepo.findById(id);
    if (!business) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_BUSINESS_NOT_FOUND));
    }

    await this.validateUpdateInput(id, data);

    //  Nếu có file mới, thì upload và xoá file cũ
    if (files?.businessLicense?.[0]) {
      const buffer = files.businessLicense[0].buffer;
      const name = files.businessLicense[0].originalname;
      data.businessLicenseFile = await this.supabaseService.uploadPdf(buffer, name, business.businessLicenseFile);
    }

    if (files?.otherDocument?.[0]) {
      const buffer = files.otherDocument[0].buffer;
      const name = files.otherDocument[0].originalname;
      data.otherDocumentFile = await this.supabaseService.uploadPdf(buffer, name, business.otherDocumentFile);
    }

    const updated = await this.businessRepo.update(business, data);
    const result = mapToBusinessResponse(updated);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_BUSINESS, result);
  }
  async delete(id: string): Promise<ApiResponse<null>> {
    const business = await this.businessRepo.findById(id);
    if (!business) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_BUSINESS_NOT_FOUND));
    }
    // xóa file trên supabase nếu có
    await this.deleteBusinessFiles(business);
    await this.businessRepo.delete(id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_DELETE_BUSINESS, null);
  }

  async exportPdf(ids: string[]): Promise<Buffer> {
    if (!ids || ids.length === 0) {
      throw new HttpException('Vui lòng chọn ít nhất 1 bản ghi', HttpStatus.BAD_REQUEST);
    }

    const business = await this.businessRepo.findByIds(ids);

    const template: PdfTemplate<Business> = {
      title: 'Danh sách doanh nghiệp',
      columns: ['STT', 'Tên doanh nghiệp', 'Mã số thuế', 'Tỉnh', 'Trạng thái'],
      mapper: (business, idx) => [
        (idx + 1).toString(),
        business.name,
        business.taxCode,
        business.registrationCity,
        business.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động',
      ],
    };

    return this.pdfGenerator.generatePdf(business, template);
  }

  async checkDuplicateTaxCode(taxCode: string, excludeId?: string): Promise<ApiResponse<boolean>> {
    const isDuplicate = await this.businessRepo.checkDuplicateFieldExceptId('taxCode', taxCode, excludeId);
    return ApiResponse.success(HttpStatus.OK, ERROR_TAXCODE_ALREADY_EXISTS, isDuplicate);
  }

  async checkDuplicateEmail(email: string, excludeId?: string): Promise<ApiResponse<boolean>> {
    const isDuplicate = await this.businessRepo.checkDuplicateFieldExceptId('email', email, excludeId);
    return ApiResponse.success(HttpStatus.OK, ERROR_EMAIL_ALREADY_EXISTS, isDuplicate);
  }

  private async validateAddInput(data: CreateBusinessRequest): Promise<void> {
    const errors: string[] = [];

    const checks = await Promise.all([
      this.businessRepo.checkDuplicateField('taxCode', data.taxCode),
      this.businessRepo.checkDuplicateField('email', data.email),
    ]);

    if (checks[0]) errors.push(ERROR_TAXCODE_ALREADY_EXISTS);
    if (checks[1]) errors.push(ERROR_EMAIL_ALREADY_EXISTS);

    if (errors.length > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.CONFLICT, errors.join(' | ')), HttpStatus.CONFLICT);
    }
  }

  private async validateUpdateInput(id: string, data: UpdateBusinessRequest): Promise<void> {
    const errors: string[] = [];

    const checks = await Promise.all([
      this.businessRepo.checkDuplicateFieldExceptId('email', data.email, id),
      this.businessRepo.checkDuplicateFieldExceptId('name', data.name, id),
    ]);

    if (checks[0]) errors.push(ERROR_EMAIL_ALREADY_EXISTS);
    if (checks[1]) errors.push(ERROR_NAME_ALREADY_EXISTS);

    if (errors.length > 0) {
      throw new HttpException(ApiResponse.fail(HttpStatus.CONFLICT, errors.join(' | ')), HttpStatus.CONFLICT);
    }
  }

  private async deleteBusinessFiles(business: Business): Promise<void> {
    const { businessLicenseFile, otherDocumentFile } = business;

    const deleteFile = async (url?: string) => {
      if (!url) return;

      try {
        await this.supabaseService.deleteByUrl(url);
      } catch (err) {
        console.error(` Không thể xoá file: ${url}`, err.message);
      }
    };

    await Promise.all([deleteFile(businessLicenseFile), deleteFile(otherDocumentFile)]);
  }
}
