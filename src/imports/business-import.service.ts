import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { BusinessType } from 'libs/shared/ATVSLD/enums/business-type.enum';
import { CreateBusinessRequest } from 'libs/shared/ATVSLD/models/requests/business/create-business.request';
import { ImportExcelResponse, importExcelGeneric } from 'libs/core/excel/excel-import';
import { BusinessService } from 'src/services/business/business.service';
import * as ExcelJS from 'exceljs';
import { validateEmail, validatePhone } from 'libs/shared/ATVSLD/utils/helper.util';
@Injectable()
export class BusinessImportService {
  constructor(private readonly businessService: BusinessService) {}

  async importFromExcel(filePath: string): Promise<ApiResponse<ImportExcelResponse>> {
    const result = await importExcelGeneric<CreateBusinessRequest>(
      filePath,
      0, // sheet index
      this.mapRowToDto,
      this.validateRow,
      async (dto) => {
        await this.businessService.create(dto);
      },
    );

    return ApiResponse.success(200, 'Import hoàn tất', result);
  }

  private mapRowToDto(row: ExcelJS.Row, rowIndex: number): CreateBusinessRequest {
    const businessTypeRaw = row.getCell(4).value?.toString().trim();

    const dto: CreateBusinessRequest = {
      name: row.getCell(1).value?.toString().trim() || '',
      taxCode: row.getCell(2).value?.toString().trim() || '',
      establishedDate: new Date(row.getCell(3).value as string),
      businessType: businessTypeRaw as BusinessType,
      mainBusinessField: row.getCell(5).value?.toString().trim() || '',
      registrationCity: row.getCell(6).value?.toString().trim() || '',
      registrationDistrict: row.getCell(7).value?.toString().trim() || '',
      registrationWard: row.getCell(8).value?.toString().trim() || '',
      registrationAddress: row.getCell(9).value?.toString() || '',
      operationCity: row.getCell(10).value?.toString().trim() || '',
      operationDistrict: row.getCell(11).value?.toString().trim() || '',
      operationWard: row.getCell(12).value?.toString().trim() || '',
      operationAddress: row.getCell(13).value?.toString().trim() || '',
      foreignName: row.getCell(14).value?.toString().trim() || '',
      email: row.getCell(15).value?.toString().trim() || '',
      phoneNumber: row.getCell(16).value?.toString() || '',
      representativeName: row.getCell(17).value?.toString() || '',
      representativePhone: row.getCell(18).value?.toString() || '',
      businessLicenseFile: '',
      otherDocumentFile: '',
    };

    return dto;
  }

  private validateRow(dto: CreateBusinessRequest, rowIndex: number): string[] {
    const errors: string[] = [];

    if (!dto.name) errors.push('Tên doanh nghiệp không được bỏ trống');
    if (!dto.taxCode) errors.push('Mã số thuế không được bỏ trống');
    if (!dto.establishedDate || isNaN(dto.establishedDate.getTime())) {
      errors.push('Ngày thành lập không hợp lệ');
    }
    if (!dto.businessType) {
      errors.push('Loại hình doanh nghiệp không được bỏ trống');
    } else if (!Object.values(BusinessType).includes(dto.businessType)) {
      errors.push(`Loại hình doanh nghiệp không hợp lệ: ${dto.businessType}`);
    }
    if (!dto.mainBusinessField) errors.push('Ngành nghề chính không được bỏ trống');
    if (!dto.registrationCity) errors.push('Tỉnh/thành phố đăng ký không được bỏ trống');
    if (!dto.registrationDistrict) errors.push('Quận/huyện đăng ký không được bỏ trống');
    if (!dto.registrationWard) errors.push('Phường/xã đăng ký không được bỏ trống');

    if (dto.email && !validateEmail(dto.email)) {
      errors.push('Email không đúng định dạng');
    }

    if (dto.phoneNumber && !validatePhone(dto.phoneNumber)) {
      errors.push('Số điện thoại không đúng định dạng');
    }

    if (dto.representativePhone && !validatePhone(dto.representativePhone)) {
      errors.push('Số điện thoại người đại diện không đúng định dạng');
    }

    return errors;
  }
}
