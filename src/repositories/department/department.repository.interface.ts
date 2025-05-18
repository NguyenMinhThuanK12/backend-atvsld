import { DepartmentResponse } from "libs/shared/ATVSLD/models/response/department/department.response";


export const IDepartmentRepository = 'IDepartmentRepository';

export interface IDepartmentRepository {
    findAll(): Promise<DepartmentResponse[]>;
    findForLogin(): Promise<{ id: number; name: string }[]>;
}
