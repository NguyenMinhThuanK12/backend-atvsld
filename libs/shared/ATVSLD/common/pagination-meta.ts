export class PaginationMeta {
  totalItems: number; // Tổng số bản ghi trong DB
  itemCount: number; // Số bản ghi thực tế trong trang hiện tại
  itemsPerPage: number; // Giới hạn số phần tử mỗi trang (limit)
  totalPages: number; // Tổng số trang (ceil)
  currentPage: number; // Trang hiện tại
}
