import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { CreateBusinessRequest } from 'libs/shared/ATVSLD/models/requests/business/create-business.request';
import { SearchBusinessQueryRequest } from 'libs/shared/ATVSLD/models/requests/business/search-business-query.request';
import { UpdateBusinessRequest } from 'libs/shared/ATVSLD/models/requests/business/update-business.request';
import { BusinessResponse } from 'libs/shared/ATVSLD/models/response/business/business.response';

export interface IBusinessService {
  findById(id: string): Promise<ApiResponse<BusinessResponse>>;
  findAllPaginated(query: PaginationQueryRequest): Promise<ApiResponse<PaginatedResponse<BusinessResponse>>>;
  findAdvanced(query: SearchBusinessQueryRequest): Promise<ApiResponse<PaginatedResponse<BusinessResponse>>>;
  create(data: CreateBusinessRequest): Promise<ApiResponse<BusinessResponse>>;
  update(id: string, data: UpdateBusinessRequest): Promise<ApiResponse<BusinessResponse>>;
  updateStatus(id: string, isActive: boolean): Promise<ApiResponse<BusinessResponse>>;
  delete(id: string): Promise<ApiResponse<null>>;
  checkDuplicateTaxCode(taxCode: string): Promise<ApiResponse<boolean>>;
  checkDuplicateEmail(email: string): Promise<ApiResponse<boolean>>;
}
