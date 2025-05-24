import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/entities/department.entity';
import { IDepartmentRepository } from './department.repository.interface';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';
import { mapToDepartmentResponse } from 'libs/shared/ATVSLD/mappers/department.mapper';
import { UpdateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department.request';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  async findPaginated(page: number, limit: number): Promise<[DepartmentResponse[], number]> {
    const [items, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = items.map(mapToDepartmentResponse);
    return [data, total];
  }

  async findById(id: number): Promise<Department | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAdvanced(query: SearchDepartmentQueryRequest): Promise<[DepartmentResponse[], number]> {
    const qb = this.repo.createQueryBuilder('department');
  
    if (query.name) {
      qb.andWhere('department.name ILIKE :name', { name: `%${query.name}%` });
    }
  
    if (query.taxCode) {
      qb.andWhere('department.taxCode = :taxCode', { taxCode: query.taxCode });
    }
  
    if (query.businessType) {
      qb.andWhere('department.businessType = :businessType', { businessType: query.businessType });
    }
  
    if (query.mainBusinessField) {
      qb.andWhere('department.mainBusinessField ILIKE :mainBusinessField', {
        mainBusinessField: `%${query.mainBusinessField}%`,
      });
    }
  
    if (query.operationCity) {
      qb.andWhere('department.operationCity = :operationCity', { operationCity: query.operationCity });
    }
  
    if (query.operationDistrict) {
      qb.andWhere('department.operationDistrict = :operationDistrict', {
        operationDistrict: query.operationDistrict,
      });
    }
  
    if (query.operationWard) {
      qb.andWhere('department.operationWard = :operationWard', { operationWard: query.operationWard });
    }
  
    if (query.operationAddress) {
      qb.andWhere('department.operationAddress ILIKE :operationAddress', {
        operationAddress: `%${query.operationAddress}%`,
      });
    }
  
    qb.skip((query.page - 1) * query.limit).take(query.limit);
  
    const [items, total] = await qb.getManyAndCount();
    const data = items.map(mapToDepartmentResponse);
    return [data, total];
  }

  async isTaxCodeExisted(taxCode: string): Promise<boolean> {
    const result = await this.repo.findOne({
      where: { taxCode },
    });
    return !!result;
  }

  async isEmailExisted(email: string): Promise<boolean> {
    if (!email) return false;

    const result = await this.repo.findOne({
      where: { email },
    });
    return !!result;
  }

  async isNameExisted(name: string): Promise<boolean> {
    if (!name) return false;
    const result = await this.repo.findOne({ where: { name } });
    return !!result;
  }

  async isPhoneNumberExisted(phoneNumber: string): Promise<boolean> {
    if (!phoneNumber) return false;
    const result = await this.repo.findOne({ where: { phoneNumber } });
    return !!result;
  }

  async isForeignNameExisted(foreignName: string): Promise<boolean> {
    if (!foreignName) return false;
    const result = await this.repo.findOne({ where: { foreignName } });
    return !!result;
  }

  async isRepresentativePhoneExisted(phone: string): Promise<boolean> {
    if (!phone) return false;
    const result = await this.repo.findOne({
      where: { representativePhone: phone },
    });
    return !!result;
  }

  async isEmailExistedExceptId(email: string, id: number): Promise<boolean> {
    const result = await this.repo.findOne({ where: { email } });
    return !!(result && result.id !== id);
  }

  async isNameExistedExceptId(name: string, id: number): Promise<boolean> {
    const result = await this.repo.findOne({ where: { name } });
    return !!(result && result.id !== id);
  }

  async isPhoneNumberExistedExceptId(phone: string, id: number): Promise<boolean> {
    const result = await this.repo.findOne({ where: { phoneNumber: phone } });
    return !!(result && result.id !== id);
  }

  async isForeignNameExistedExceptId(foreignName: string, id: number): Promise<boolean> {
    const result = await this.repo.findOne({ where: { foreignName } });
    return !!(result && result.id !== id);
  }

  async isRepresentativePhoneExistedExceptId(phone: string, id: number): Promise<boolean> {
    const result = await this.repo.findOne({
      where: { representativePhone: phone },
    });
    return !!(result && result.id !== id);
  }

  async create(data: Department): Promise<Department> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async update(target: Department, data: UpdateDepartmentRequest): Promise<Department> {
    const entity = this.repo.merge(target, data);
    return await this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
