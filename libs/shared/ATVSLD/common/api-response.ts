// 📄 File: libs/shared/ATVSLD/common/api-response.ts

export class ApiResponse<T> {
  /**
   * HTTP status code: 200, 201, 400, 404, etc.
   */
  status: number;
  message: string;
  data: T;

  constructor(status: number, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(status: number, message: string, data: T): ApiResponse<T> {
    return new ApiResponse<T>(status, message, data);
  }

  static fail<T = null>(status: number, message: string, data: T = null): ApiResponse<T> {
    return new ApiResponse<T>(status, message, data);
  }
}
