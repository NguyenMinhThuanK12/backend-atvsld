import { User } from 'src/entities/user.entity';
import { IBaseRepository } from '../base/base.repository.interface';
import { FindManyOptions } from 'typeorm';
import { SearchUserQueryRequest } from 'libs/shared/ATVSLD/models/requests/user/search-user-query.request';

export const IUserRepository = 'IUserRepository';
export interface IUserRepository extends IBaseRepository<User> {
  findByAccount(account: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | undefined>;
  findAdvanced(query: SearchUserQueryRequest): Promise<[User[], number]>;
  count(options?: FindManyOptions<User>): Promise<number>;
  save(user: User): Promise<User>;
  deactivateAllUsersByBusiness(businessId: string): Promise<void>;
  activateAllUsersByBusiness(businessId: string): Promise<void>;
}
