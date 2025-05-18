export interface IDepartmentService {
    findForLogin(): Promise<{ id: number; name: string }[]>;
  }