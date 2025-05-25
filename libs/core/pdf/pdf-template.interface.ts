export interface PdfTemplate<T> {
    title: string;
    columns: string[];         // Tên cột
    mapper: (item: T, index: number) => string[]; //Dữ liệu từng dòng chuyển thành mảng string
  }