import { PaginationMeta } from './pagination-meta';

export class PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
