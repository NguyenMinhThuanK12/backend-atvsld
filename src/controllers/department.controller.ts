import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'libs/core/auth/jwt-auth.guard';
import { DepartmentService } from 'src/services/department/department.service';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('login-list')
  async getDepartmentsForLogin() {
    return this.departmentService.findForLogin();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDepartments() {
    return this.departmentService.findAll();
  }
}
