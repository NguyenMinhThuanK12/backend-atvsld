import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { mapToReportInstanceResponse } from 'libs/shared/ATVSLD/mappers/report-instance.mapper';
import { SearchReportInstanceRequest } from 'libs/shared/ATVSLD/models/requests/report-instance/search-report-instance.request';
import { ReportInstanceResponse } from 'libs/shared/ATVSLD/models/response/report-instance/report-instance.response';
import { IReportInstanceRepository } from 'src/repositories/report-instance/report-instance.repository.interface';
import { IReportInstanceService } from './report-instance.service.interface';
import { SUCCESS_GET_BUSINESS_LIST } from 'libs/shared/ATVSLD/constants/business-message.constant';
import { ERROR_NO_DATA } from 'libs/shared/ATVSLD/constants/system.constant';

@Injectable()
export class ReportInstanceService implements IReportInstanceService {
  constructor(
    @Inject(IReportInstanceRepository)
    private readonly repo: IReportInstanceRepository,
  ) {}

  async search(
    query: SearchReportInstanceRequest,
    businessId?: string,
  ): Promise<ApiResponse<PaginatedResponse<ReportInstanceResponse>>> {
    const [items, total] = await this.repo.findAdvanced(query, businessId);
    const data = items.map(mapToReportInstanceResponse);
    const response: PaginatedResponse<ReportInstanceResponse> = {
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
}
