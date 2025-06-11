import { Inject, Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { IReportConfigurationService } from './report-configuration.service.interface';
import { IReportConfigurationRepository } from 'src/repositories/report-configuration/report-configuration.repository.interface';
import { CreateReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/create-report-config.request';
import { UpdateReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/update-report-config.request';
import { SearchReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/search-report-config.request';
import {
  mapToReportConfigEntity,
  mapToReportConfigResponse,
} from 'libs/shared/ATVSLD/mappers/report-configuration.mapper';
import { ReportConfigResponse } from 'libs/shared/ATVSLD/models/response/report-configuration/report-config.response';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { IBusinessRepository } from 'src/repositories/business/business.repository.interface';
import { ReportInstance } from 'src/entities/report-instance.entity';
import { ReportStatusEnum } from 'libs/shared/ATVSLD/enums/report-status.enum';
import { DataSource } from 'typeorm';
import { ERROR_NO_DATA } from 'libs/shared/ATVSLD/constants/system.constant';
import {
  ERROR_CONFIG_NOT_FOUND,
  ERROR_DUPLICATE_YEAR,
  ERROR_INVALID_DATE_RANGE,
  SUCCESS_CREATE_CONFIG,
  SUCCESS_GET_CONFIG_DETAIL,
  SUCCESS_GET_CONFIG_LIST,
  SUCCESS_UPDATE_CONFIG,
} from 'libs/shared/ATVSLD/constants/report-configuration-message.constant';

@Injectable()
export class ReportConfigurationService implements IReportConfigurationService {
  constructor(
    @Inject(IReportConfigurationRepository)
    private readonly repo: IReportConfigurationRepository,
    @Inject(IBusinessRepository)
    private readonly businessRepo: IBusinessRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateReportConfigRequest): Promise<ApiResponse<ReportConfigResponse>> {
    if (dto.startDate >= dto.endDate) {
      throw new HttpException(ERROR_INVALID_DATE_RANGE, HttpStatus.OK);
    }

    const isDuplicate = await this.repo.checkYearConflict(dto.reportName, dto.year);
    if (isDuplicate) {
      throw new HttpException(ERROR_DUPLICATE_YEAR, HttpStatus.OK);
    }

    const config = await this.repo.create(mapToReportConfigEntity(dto));

    const businesses = await this.businessRepo.findActive();
    const instances = businesses.map((biz) => {
      const ri = new ReportInstance();
      ri.configId = config.id;
      ri.businessId = biz.id;
      ri.status = ReportStatusEnum.PENDING;
      return ri;
    });
    await this.dataSource.getRepository(ReportInstance).save(instances);

    return ApiResponse.success(HttpStatus.CREATED, SUCCESS_CREATE_CONFIG, mapToReportConfigResponse(config));
  }

  async update(id: string, dto: UpdateReportConfigRequest): Promise<ApiResponse<ReportConfigResponse>> {
    const config = await this.repo.findById(id);
    if (!config) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.OK, ERROR_CONFIG_NOT_FOUND));
    }

    if (dto.startDate && dto.endDate && dto.startDate >= dto.endDate) {
      throw new HttpException(ERROR_INVALID_DATE_RANGE, HttpStatus.OK);
    }

    if (dto.year || dto.reportName) {
      const isDuplicate = await this.repo.checkYearConflict(
        dto.reportName || config.reportName,
        dto.year || config.year,
        id,
      );
      if (isDuplicate) {
        throw new HttpException(ERROR_DUPLICATE_YEAR, HttpStatus.OK);
      }
    }

    const updated = await this.repo.update(config, dto);
    const result = await this.repo.findById(updated.id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_CONFIG, mapToReportConfigResponse(result));
  }
  async toggleActive(id: string): Promise<ApiResponse<{ isActive: boolean }>> {
    const config = await this.repo.findById(id);
    if (!config) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.OK, ERROR_CONFIG_NOT_FOUND));
    }

    await this.repo.update(config, { isActive: !config.isActive });

    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_CONFIG, {
      isActive: !config.isActive,
    });
  }
  async findById(id: string): Promise<ApiResponse<ReportConfigResponse>> {
    const config = await this.repo.findById(id);
    if (!config) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.OK, ERROR_CONFIG_NOT_FOUND));
    }
    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_CONFIG_DETAIL, mapToReportConfigResponse(config));
  }

  async findAdvanced(query: SearchReportConfigRequest): Promise<ApiResponse<PaginatedResponse<ReportConfigResponse>>> {
    const [items, total] = await this.repo.findAdvanced(query);
    const data = items.map(mapToReportConfigResponse);
    const response: PaginatedResponse<ReportConfigResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: query.limit,
        totalPages: Math.ceil(total / query.limit),
        currentPage: query.page,
      },
    };

    const message = data.length === 0 ? ERROR_NO_DATA : SUCCESS_GET_CONFIG_LIST;
    return ApiResponse.success(HttpStatus.OK, message, response);
  }
}
