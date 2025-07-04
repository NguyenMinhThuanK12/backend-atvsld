import { Inject, Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { IReportDetailRepository } from 'src/repositories/report-detail/report-detail.repository.interface';

import { ReportDetailResponse } from 'libs/shared/ATVSLD/models/response/report-detail/report-detail.response';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';

import { IReportDetailService } from './report-detail.service.interface';
import {
  SUCCESS_CREATE_DETAIL,
  ERROR_DETAIL_NOT_FOUND,
  SUCCESS_UPDATE_DETAIL,
  SUCCESS_GET_DETAIL,
} from 'libs/shared/ATVSLD/constants/report-detail-message.constant';
import { mapToReportDetailEntity, mapToReportDetailResponse } from 'libs/shared/ATVSLD/mappers/report-detail.mapper';
import { ReportStatusEnum } from 'libs/shared/ATVSLD/enums/report-status.enum';
import { ReportInstance } from 'src/entities/report-instance.entity';
import { UpdateReportDetailRequest } from 'libs/shared/ATVSLD/models/requests/report-detail/update-report-detail.request';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportDetailService implements IReportDetailService {
  constructor(
    @Inject(IReportDetailRepository)
    private readonly repo: IReportDetailRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<ApiResponse<ReportDetailResponse>> {
    const detail = await this.repo.findById(id);
    if (!detail) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.OK, ERROR_DETAIL_NOT_FOUND));
    }
    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_DETAIL, mapToReportDetailResponse(detail));
  }

  async findByInstanceId(instanceId: string): Promise<ApiResponse<ReportDetailResponse>> {
    const detail = await this.repo.findByInstanceId(instanceId);
    if (!detail) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.OK, ERROR_DETAIL_NOT_FOUND));
    }
    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_DETAIL, mapToReportDetailResponse(detail));
  }
  async create(dto: UpdateReportDetailRequest): Promise<ApiResponse<ReportDetailResponse>> {
    const entity = mapToReportDetailEntity(dto);
    const detail = await this.repo.create(entity);
    const result = await this.repo.findById(detail.id);
    return ApiResponse.success(HttpStatus.CREATED, SUCCESS_CREATE_DETAIL, mapToReportDetailResponse(result));
  }

  async update(id: string, dto: UpdateReportDetailRequest): Promise<ApiResponse<ReportDetailResponse>> {
    const current = await this.repo.findById(id);
    if (!current) {
      throw new NotFoundException(ApiResponse.fail(HttpStatus.OK, ERROR_DETAIL_NOT_FOUND));
    }

    await this.repo.update(current, dto);

    const instanceRepo = this.dataSource.getRepository(ReportInstance);
    const instance = await instanceRepo.findOneBy({ id: current.instanceId });

    if (instance) {
      instance.status = dto.status === 'Hoàn thành' ? ReportStatusEnum.COMPLETED : ReportStatusEnum.EDITING;
      instance.lastUpdatedBy = dto.fullName;
      instance.lastUpdatedDate = new Date();
      await instanceRepo.save(instance);
    }

    const updated = await this.repo.findById(id);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_UPDATE_DETAIL, mapToReportDetailResponse(updated));
  }
}
