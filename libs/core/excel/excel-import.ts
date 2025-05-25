import * as ExcelJS from 'exceljs';
export interface ImportError {
    row: number;
    message: string;
  }
  
  export class ImportExcelResponse {
    successCount: number;
    errorCount: number;
    errors: ImportError[];
  }
  

export type RowToDtoMapper<T> = (row: ExcelJS.Row, rowIndex: number) => T;
export type RowValidator<T> = (dto: T, rowIndex: number) => string[];
export type RowProcessor<T> = (dto: T) => Promise<void>;

export async function importExcelGeneric<T>(
  filePath: string,
  sheetIndex: number,
  mapRowToDto: RowToDtoMapper<T>,
  validateRow: RowValidator<T>,
  processRow: RowProcessor<T>
): Promise<ImportExcelResponse> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[sheetIndex];

  let successCount = 0;
  let errorCount = 0;
  const errors: ImportError[] = [];

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    try {
      const dto = mapRowToDto(row, i);

      const validationErrors = validateRow(dto, i);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(' | '));
      }

      await processRow(dto);
      successCount++;
    } catch (error) {
      errorCount++;
      errors.push({
        row: i,
        message: (error as Error).message || 'Unknown error',
      });
    }
  }

  return {
    successCount,
    errorCount,
    errors,
  };
}