import { CreateReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/create-report-config.request';
import { UpdateReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/update-report-config.request';
import { SearchReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/search-report-config.request';
import { ReportConfigResponse } from 'libs/shared/ATVSLD/models/response/report-configuration/report-config.response';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';

export interface IReportConfigurationService {
  create(dto: CreateReportConfigRequest): Promise<ApiResponse<ReportConfigResponse>>;
  update(id: string, dto: UpdateReportConfigRequest): Promise<ApiResponse<ReportConfigResponse>>;
  findById(id: string): Promise<ApiResponse<ReportConfigResponse>>;
  findAdvanced(query: SearchReportConfigRequest): Promise<ApiResponse<PaginatedResponse<ReportConfigResponse>>>;
}
