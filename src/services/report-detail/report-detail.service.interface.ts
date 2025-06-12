import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { UpdateReportDetailRequest } from 'libs/shared/ATVSLD/models/requests/report-detail/update-report-detail.request';

import { ReportDetailResponse } from 'libs/shared/ATVSLD/models/response/report-detail/report-detail.response';

export interface IReportDetailService {
  create(dto: UpdateReportDetailRequest): Promise<ApiResponse<ReportDetailResponse>>;
  update(id: string, dto: UpdateReportDetailRequest, userFullName: string): Promise<ApiResponse<ReportDetailResponse>>;
  findByInstanceId(instanceId: string): Promise<ApiResponse<ReportDetailResponse>>;
}
