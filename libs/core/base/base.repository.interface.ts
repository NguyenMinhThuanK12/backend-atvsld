import { DeepPartial } from "typeorm/common/DeepPartial";

export interface IBaseRepository<T> {
  findById(id: number): Promise<T | null>;
  create(data: T): Promise<T>;
  update(target: T, data: DeepPartial<T>): Promise<T>
  delete(id: number): Promise<void>;
  hardDelete(id: number): Promise<void>;
  softDelete(id: number): Promise<void>;
  findPaginated(page: number, limit: number): Promise<[T[], number]>;
  checkDuplicateField<K extends keyof T>(field: K, value: T[K]): Promise<boolean>;
  checkDuplicateFieldExceptId<K extends keyof T>(field: K, value: T[K], id: number): Promise<boolean>;
}
