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
    await this.softDelete(id);
  }

  async findByAccount(username: string): Promise<User | null> {
    return await this.repo.findOne({
      where: { username },
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
    const qb = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.business', 'business')
      .where('1=1');

    if (query.username) {
      qb.andWhere('unaccent(user.account) ILIKE unaccent(:username)', {
        username: `%${query.username}%`,
      });
    }

    if (query.fullName) {
      qb.andWhere('unaccent(user.full_name) ILIKE unaccent(:fullName)', {
        fullName: `%${query.fullName}%`,
      });
    }

    if (query.jobTitle) {
      qb.andWhere('unaccent(user.job_title) ILIKE unaccent(:jobTitle)', {
        jobTitle: `%${query.jobTitle}%`,
      });
    }

    if (query.roleId) {
      qb.andWhere('user.role_id = :roleId', { roleId: query.roleId });
    }

    if (query.userType) {
      qb.andWhere('user.user_type = :userType', { userType: query.userType });
    }

    if (query.businessId) {
      qb.andWhere('user.business_id = :businessId', { businessId: query.businessId });
    }

    if (query.isActive !== undefined) {
      qb.andWhere('user.is_active = :isActive', { isActive: query.isActive });
    }

    qb.orderBy('user.created_at', 'DESC');
    qb.skip((query.page - 1) * query.limit).take(query.limit);

    return qb.getManyAndCount();
  }

  async deactivateAllUsersByBusiness(businessId: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(User)
      .set({ isActive: false })
      .where('business_id = :businessId', { businessId })
      .execute();
  }

  async activateAllUsersByBusiness(businessId: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(User)
      .set({ isActive: true })
      .where('business_id = :businessId', { businessId })
      .execute();
  }
}
