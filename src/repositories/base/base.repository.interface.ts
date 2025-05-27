import { DeepPartial } from 'typeorm/common/DeepPartial';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findByIds(ids: string[]): Promise<T[]>;
  create(data: T): Promise<T>;
  update(target: T, data: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  findPaginated(page: number, limit: number): Promise<[T[], number]>;
  checkDuplicateField<K extends keyof T>(field: K, value: T[K]): Promise<boolean>;
  checkDuplicateFieldExceptId<K extends keyof T>(field: K, value: T[K], id: string): Promise<boolean>;
}
