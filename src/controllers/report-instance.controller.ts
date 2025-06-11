import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { SearchReportInstanceRequest } from 'libs/shared/ATVSLD/models/requests/report-instance/search-report-instance.request';
import { ReportInstanceResponse } from 'libs/shared/ATVSLD/models/response/report-instance/report-instance.response';
import { ReportInstanceService } from 'src/services/report-instance/report-instance.service';

@Controller('report-instances')
export class ReportInstanceController {
  constructor(private readonly service: ReportInstanceService) {}

  @Get('search')
  async search(
    @Query() query: SearchReportInstanceRequest,
  ): Promise<ApiResponse<PaginatedResponse<ReportInstanceResponse>>> {
    return this.service.search(query);
  }
}
