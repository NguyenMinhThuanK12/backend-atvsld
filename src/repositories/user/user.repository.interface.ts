import { User } from 'src/entities/user.entity';
import { IBaseRepository } from '../base/base.repository.interface';
import { FindManyOptions } from 'typeorm';

export const IUserRepository = 'IUserRepository';
export interface IUserRepository extends IBaseRepository<User> {
  findByAccount(account: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | undefined>;
  count(options?: FindManyOptions<User>): Promise<number>;
  save(user: User): Promise<User>;
}
