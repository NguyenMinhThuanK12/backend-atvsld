import { Module } from '@nestjs/common';
import { PdfGeneratorService } from 'libs/core/pdf/pdf-generator.service';


@Module({
  providers: [PdfGeneratorService],
  exports: [PdfGeneratorService],
})
export class PdfModule {}
