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

  async findByAccountAndDepartment(account: string, departmentId: number): Promise<User | null> {
    return this.repo.findOne({
      where: {
        account,
        department: { id: departmentId },
      },
      relations: ['department', 'role'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.repo.findOne({ where: { id } });
  }
  
  async save(user: User): Promise<User> {
    return await this.repo.save(user);
  }
}
