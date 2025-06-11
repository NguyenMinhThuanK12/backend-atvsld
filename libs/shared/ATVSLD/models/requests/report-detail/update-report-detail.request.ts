import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDetailRequest } from './create-report-detail.request';

export class UpdateReportDetailRequest extends PartialType(CreateReportDetailRequest) {}
