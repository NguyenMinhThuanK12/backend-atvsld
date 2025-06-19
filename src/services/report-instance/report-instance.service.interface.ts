import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { SearchReportInstanceRequest } from 'libs/shared/ATVSLD/models/requests/report-instance/search-report-instance.request';
import { ReportInstanceBusinessResponse } from 'libs/shared/ATVSLD/models/response/report-instance/report-instance-business.response';
import { ReportInstanceResponse } from 'libs/shared/ATVSLD/models/response/report-instance/report-instance.response';

export interface IReportInstanceService {
  search(query: SearchReportInstanceRequest): Promise<ApiResponse<ReportInstanceResponse[]>>;
  getActiveYears(businessId?: string): Promise<ApiResponse<number[]>>;
  findBusinessInfo(id: string): Promise<ApiResponse<ReportInstanceBusinessResponse>>;
  markCompleted(id: string, fullName: string): Promise<ApiResponse<{ isCompleted: boolean }>>;
}
