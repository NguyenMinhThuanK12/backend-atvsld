import PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { PdfTemplate } from './pdf-template.interface';
import { Buffer } from 'buffer';

@Injectable()
export class PdfGeneratorService {
  async generatePdf<T>(data: T[], template: PdfTemplate<T>): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });

    // Font
    doc.registerFont('Roboto', path.join(process.cwd(), 'libs/core/pdf/fonts/Roboto-Regular.ttf'));
    doc.registerFont('Roboto-Bold', path.join(process.cwd(), 'libs/core/pdf/fonts/Roboto-Bold.ttf'));
    doc.font('Roboto');
    doc.font('Roboto-Bold');

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Title
    doc.fontSize(16).text(template.title, { align: 'center' }).moveDown(1);

    // Column widths
    const colWidths = [50, 180, 120, 100, 100]; // STT, Name, Tax, Province, Status
    const startX = 50;
    let y = doc.y;

    // Đặt chiều cao mỗi dòng
    const rowHeight = 25;

    // Header (bold + border)
    doc.fontSize(12).font('Roboto-Bold');
    template.columns.forEach((col, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);

      // Vẽ khung ô
      doc.rect(x, y, colWidths[i], rowHeight).stroke();
      doc.text(col, x + 5, y + 7, { width: colWidths[i] - 10, align: 'left' }); // padding 5
    });

    y += rowHeight;

    // Rows (dữ liệu + border)
    doc.fontSize(11).font('Roboto');
    data.forEach((item, rowIndex) => {
      const row = template.mapper(item, rowIndex);
      row.forEach((cell, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);

        // Vẽ khung ô
        doc.rect(x, y, colWidths[i], rowHeight).stroke();
        doc.text(cell, x + 5, y + 7, { width: colWidths[i] - 10, align: 'left' }); // padding 5
      });
      y += rowHeight;
    });

    doc.end();

    return new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  }
}
