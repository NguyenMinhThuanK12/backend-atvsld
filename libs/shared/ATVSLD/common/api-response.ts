export class ApiResponse<T> {
    status: boolean;
    message: string;
    data?: T;
  
    /**
     * Constructor khởi tạo một response 
     * @param status Trạng thái thành công/thất bại
     * @param message Thông điệp dành cho FE
     * @param data Dữ liệu thực tế trả về (tuỳ chọn)
     */
    constructor(status: boolean, message: string, data?: T) {
      this.status = status;
      this.message = message;
      if (data !== undefined) {
        this.data = data;
      }
    }
  
    // Shortcut: Response thành công với dữ liệu
    static success<T>(message: string, data?: T): ApiResponse<T> {
      return new ApiResponse<T>(true, message, data);
    }
  
    // Response thất bại
    static fail<T = null>(message: string): ApiResponse<T> {
      return new ApiResponse<T>(false, message);
    }
  }