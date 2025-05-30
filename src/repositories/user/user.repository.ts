import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from './user.repository.interface';
import { BaseRepository } from '../base/base.repository';
import { SearchUserQueryRequest } from 'libs/shared/ATVSLD/models/requests/user/search-user-query.request';

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    protected readonly repo: Repository<User>,
  ) {
    super(repo);
  }
  async delete(id: string): Promise<void> {
    await this.softDelete(id); // dùng soft delete  (override lại hàm delete trong BaseRepository)
  }
  async findByAccount(account: string): Promise<User | null> {
    return await this.repo.findOne({
      where: {
        account,
      },
      relations: ['role'],
    });
  }
  async count(options?: FindManyOptions<User>): Promise<number> {
    return this.repo.count(options);
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.repo.findOne({ where: { id } });
  }

  async save(user: User): Promise<User> {
    return await this.repo.save(user);
  }

  async findAdvanced(query: SearchUserQueryRequest): Promise<[User[], number]> {
    const qb = this.repo.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role').where('1=1');

    if (query.account) {
      qb.andWhere('unaccent(user.account) ILIKE unaccent(:account)', {
        account: `%${query.account}%`,
      });
    }

    if (query.full_name) {
      qb.andWhere('unaccent(user.full_name) ILIKE unaccent(:full_name)', {
        full_name: `%${query.full_name}%`,
      });
    }

    if (query.email) {
      qb.andWhere('unaccent(user.email) ILIKE unaccent(:email)', {
        email: `%${query.email}%`,
      });
    }

    if (query.phone) {
      qb.andWhere('user.phone ILIKE :phone', { phone: `%${query.phone}%` });
    }

    if (query.role_id) {
      qb.andWhere('user.role_id = :role_id', { role_id: query.role_id });
    }

    if (query.user_type) {
      qb.andWhere('user.user_type = :user_type', { user_type: query.user_type });
    }

    qb.orderBy('user.created_at', 'DESC');
    qb.skip((query.page - 1) * query.limit).take(query.limit);

    return qb.getManyAndCount();
  }
}
