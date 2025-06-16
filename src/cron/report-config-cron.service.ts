import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { ReportConfiguration } from 'src/entities/report-configuration.entity';

@Injectable()
export class ReportConfigCronService {
  private readonly logger = new Logger(ReportConfigCronService.name);

  constructor(private readonly dataSource: DataSource) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Chạy mỗi ngày lúc 0:00
  async handleUpdateOverdueConfigs() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt mốc thời gian về 00:00:00

    const repo = this.dataSource.getRepository(ReportConfiguration);

    const result = await repo
      .createQueryBuilder()
      .update(ReportConfiguration)
      .set({ isOverdue: true })
      .where('endDate < :today', { today })
      .andWhere('isOverdue = false') // chỉ cập nhật cái nào chưa quá hạn
      .execute();

    this.logger.log(`Updated ${result.affected} overdue report configurations.`);
  }
}
