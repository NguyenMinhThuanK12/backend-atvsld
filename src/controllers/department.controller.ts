import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'libs/core/auth/jwt-auth.guard';
import { DepartmentService } from 'src/services/department/department.service';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // Public: dùng cho màn login
  @Get('login-list')
  @HttpCode(HttpStatus.OK)
  async getDepartmentsForLogin() {
    const data = await this.departmentService.findAll();
    return ApiResponse.success(HttpStatus.OK, 'Lấy danh sách đơn vị cho đăng nhập thành công', data);
  }

  // Protected: chỉ dùng sau khi đăng nhập
  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllDepartments() {
    const data = await this.departmentService.findAll();
    return ApiResponse.success(HttpStatus.OK, 'Lấy toàn bộ danh sách đơn vị thành công', data);
  }
}
