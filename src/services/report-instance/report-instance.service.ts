import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { mapToReportInstanceResponse } from 'libs/shared/ATVSLD/mappers/report-instance.mapper';
import { SearchReportInstanceRequest } from 'libs/shared/ATVSLD/models/requests/report-instance/search-report-instance.request';
import { ReportInstanceResponse } from 'libs/shared/ATVSLD/models/response/report-instance/report-instance.response';
import { IReportInstanceRepository } from 'src/repositories/report-instance/report-instance.repository.interface';
import { IReportInstanceService } from './report-instance.service.interface';
import { SUCCESS_GET_BUSINESS_LIST } from 'libs/shared/ATVSLD/constants/business-message.constant';
import { ERROR_NO_DATA } from 'libs/shared/ATVSLD/constants/system.constant';
import { SUCCESS_GET_ACTIVE_YEARS } from 'libs/shared/ATVSLD/constants/report-message.constant';

@Injectable()
export class ReportInstanceService implements IReportInstanceService {
  constructor(
    @Inject(IReportInstanceRepository)
    private readonly repo: IReportInstanceRepository,
  ) {}

  async search(
    query: SearchReportInstanceRequest,
    businessId?: string,
  ): Promise<ApiResponse<ReportInstanceResponse[]>> {
    // Khởi tạo query mặc định nếu không có
    if (!query) {
      query = new SearchReportInstanceRequest();
    }

    // Nếu toàn bộ query không có gì (năm không có), thì lấy năm mới nhất
    if (!query.year) {
      const years = await this.repo.findActiveYears(businessId);
      if (years.length > 0) {
        query.year = String(years[0]); // lấy năm mới nhất
      }
    }
    const [items] = await this.repo.findAdvanced(query, businessId);
    const data = items.map(mapToReportInstanceResponse);

    const message = data.length === 0 ? ERROR_NO_DATA : SUCCESS_GET_BUSINESS_LIST;
    return ApiResponse.success(HttpStatus.OK, message, data);
  }
  async getActiveYears(businessId?: string): Promise<ApiResponse<number[]>> {
    const years = await this.repo.findActiveYears(businessId);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_GET_ACTIVE_YEARS, years);
  }
}
