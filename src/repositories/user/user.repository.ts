import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByAccount(account: string): Promise<User | null> {
    return await this.repo.findOne({
      where: {
        account,
      },
      relations: ['role'],
    });
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
}
