import { User } from 'src/entities/user.entity';

export const IUserRepository = 'IUserRepository';
export interface IUserRepository {
  findByAccount(account: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
