import { Controller, Post, Body, Get, Param, Patch, Query } from '@nestjs/common';
import { ReportConfigurationService } from 'src/services/report-configuration/report-configuration.service';
import { CreateReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/create-report-config.request';
import { UpdateReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/update-report-config.request';
import { SearchReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/search-report-config.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { ReportConfigResponse } from 'libs/shared/ATVSLD/models/response/report-configuration/report-config.response';
@Controller({ path: 'report-configurations', version: '1' })
export class ReportConfigurationController {
  constructor(private readonly service: ReportConfigurationService) {}

  @Get('check-duplicate-year')
  async checkDuplicate(
    @Query('reportName') reportName: string,
    @Query('year') year: string,
    @Query('excludeId') excludeId?: string,
  ) {
    return this.service.checkDuplicate(reportName, year, excludeId);
  }
  @Post()
  async create(@Body() dto: CreateReportConfigRequest): Promise<ApiResponse<ReportConfigResponse>> {
    return this.service.create(dto);
  }

  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string): Promise<ApiResponse<{ isActive: boolean }>> {
    return this.service.toggleActive(id);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReportConfigRequest,
  ): Promise<ApiResponse<ReportConfigResponse>> {
    return this.service.update(id, dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ApiResponse<ReportConfigResponse>> {
    return this.service.findById(id);
  }

  @Get()
  async search(@Query() query: SearchReportConfigRequest) {
    return this.service.findAdvanced(query);
  }
}
