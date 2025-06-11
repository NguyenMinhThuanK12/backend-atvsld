import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateReportDetailRequest } from 'libs/shared/ATVSLD/models/requests/report-detail/create-report-detail.request';
import { UpdateReportDetailRequest } from 'libs/shared/ATVSLD/models/requests/report-detail/update-report-detail.request';

import { ReportDetailService } from 'src/services/report-detail/report-detail.service';

@Controller('report-details')
export class ReportDetailController {
  constructor(private readonly reportDetailService: ReportDetailService) {}

  // Lấy chi tiết theo instanceId
  @Get('instance/:instanceId')
  async getByInstanceId(@Param('instanceId') instanceId: string) {
    return this.reportDetailService.findByInstanceId(instanceId);
  }

  // Lấy chi tiết báo cáo theo id
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.reportDetailService.findById(id);
  }
  // Tạo mới chi tiết báo cáo
  @Post()
  async create(@Body() dto: CreateReportDetailRequest) {
    return this.reportDetailService.create(dto);
  }

  // Cập nhật chi tiết báo cáo theo instanceId
  @Patch('instance/:instanceId')
  async update(@Param('instanceId') instanceId: string, @Body() dto: UpdateReportDetailRequest) {
    return this.reportDetailService.update(instanceId, dto);
  }
}
