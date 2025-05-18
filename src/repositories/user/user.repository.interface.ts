import { User } from 'src/entities/user.entity';

export const IUserRepository = 'IUserRepository';
export interface IUserRepository {
  findByAccountAndDepartment(account: string, departmentId: number): Promise<User | null>;
}
