import { DepartmentResponse } from "libs/shared/ATVSLD/models/response/department/department.response";

export interface IDepartmentService {
    findAll(): Promise<DepartmentResponse[]>;
    findForLogin(): Promise<{ id: number; name: string }[]>;
  }