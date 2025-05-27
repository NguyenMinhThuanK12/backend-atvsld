import { DeepPartial, In, Repository } from 'typeorm';
import { IBaseRepository } from './base.repository.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly repo: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repo.findOne({ where: { id } as any });
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return this.repo.findBy({ id: In(ids) } as any);
  }

  async create(data: T): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(target: T, data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.merge(target, data);
    return this.repo.save(entity);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async delete(id: string): Promise<void> {
    await this.hardDelete(id); // Default là hard delete, override nếu muốn soft
  }

  async findPaginated(page: number, limit: number): Promise<[T[], number]> {
    return this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
      } as any,
    });
  }
  // Kiểm tra trùng khi thêm mới
  async checkDuplicateField<K extends keyof T>(field: K, value: T[K]): Promise<boolean> {
    if (!value) return false;

    const where = { [field]: value } as any;
    const result = await this.repo.findOne({ where });
    return !!result;
  }

  // kiểm tra trùng khi cập nhật (trừ chính nó ra)
  async checkDuplicateFieldExceptId<K extends keyof T>(field: K, value: T[K], id: string): Promise<boolean> {
    if (!value) return false;

    const where = { [field]: value } as any;
    const result = await this.repo.findOne({ where });
    return !!(result && (result as any).id !== id);
  }
}
