import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from 'libs/core/auth/current-user.decorator';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';
import { JwtPayload } from 'libs/shared/ATVSLD/models/requests/auth/jwt-payload';
import { SearchReportInstanceRequest } from 'libs/shared/ATVSLD/models/requests/report-instance/search-report-instance.request';
import { ReportInstanceResponse } from 'libs/shared/ATVSLD/models/response/report-instance/report-instance.response';
import { ReportInstanceService } from 'src/services/report-instance/report-instance.service';
@Controller({ path: 'report-instances', version: '1' })
export class ReportInstanceController {
  constructor(private readonly service: ReportInstanceService) {}

  @Get('search')
  async search(
    @Query() query: SearchReportInstanceRequest,
    @CurrentUser() user?: JwtPayload,
  ): Promise<ApiResponse<ReportInstanceResponse[]>> {
    const businessId = user?.userType === UserTypeEnum.BUSINESS ? user.businessId : undefined;
    return this.service.search(query, businessId);
  }
  @Get('years')
  async getYears(@CurrentUser() user?: JwtPayload): Promise<ApiResponse<number[]>> {
    const businessId = user?.userType === UserTypeEnum.BUSINESS ? user.businessId : undefined;
    return this.service.getActiveYears(businessId);
  }
}
