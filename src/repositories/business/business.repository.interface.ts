import { IBaseRepository } from 'src/repositories/base/base.repository.interface';
import { SearchBusinessQueryRequest } from 'libs/shared/ATVSLD/models/requests/business/search-business-query.request';
import { Business } from 'src/entities/business.entity';

export const IBusinessRepository = 'IBusinessRepository';

export interface IBusinessRepository extends IBaseRepository<Business> {
  findAdvanced(query: SearchBusinessQueryRequest): Promise<[Business[], number]>;
  updateStatus(id: string, isActive: boolean): Promise<Business>;
}
