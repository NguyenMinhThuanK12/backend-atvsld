import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BusinessType } from '../../libs/shared/ATVSLD/enums/business-type.enum';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Tên doanh nghiệp

  @Column({ name: 'tax_code', length: 20 })
  taxCode: string; // Mã số thuế

  @Column({ name: 'established_date', type: 'date' })
  establishedDate: Date; // Ngày cấp giấy phép đăng ký kinh doanh (GPKD)

  @Column({ name: 'business_type', type: 'enum', enum: BusinessType })
  businessType: BusinessType; // Loại hình doanh nghiệp (enum)

  @Column({ name: 'main_business_field' })
  mainBusinessField: string; // Ngành nghề kinh doanh chính

  @Column({ name: 'registration_city' })
  registrationCity: string; // Tỉnh/Thành phố đăng ký kinh doanh

  @Column({ name: 'registration_district' })
  registrationDistrict: string; // Quận/Huyện đăng ký kinh doanh

  @Column({ name: 'registration_ward' })
  registrationWard: string; // Phường/Xã đăng ký kinh doanh

  @Column({ name: 'registration_address', nullable: true })
  registrationAddress: string; // Địa chỉ cụ thể nơi đăng ký kinh doanh (số nhà, đường...)

  @Column({ name: 'operation_city', nullable: true })
  operationCity: string; // Tỉnh/TP nơi doanh nghiệp thực sự hoạt động

  @Column({ name: 'operation_district', nullable: true })
  operationDistrict: string; // Quận/Huyện hoạt động

  @Column({ name: 'operation_ward', nullable: true })
  operationWard: string; // Phường/Xã hoạt động

  @Column({ name: 'operation_address', nullable: true })
  operationAddress: string; // Địa điểm kinh doanh (khác với nơi đăng ký)

  @Column({ name: 'foreign_name', nullable: true })
  foreignName: string; // Tên doanh nghiệp bằng tiếng nước ngoài (nếu có)

  @Column({ nullable: true })
  email: string; // Email liên hệ chính của doanh nghiệp

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string; // Số điện thoại cơ quan

  @Column({ name: 'representative_name', nullable: true })
  representativeName: string; // Người đứng đầu doanh nghiệp

  @Column({ name: 'representative_phone', nullable: true })
  representativePhone: string; // Số điện thoại của người đứng đầu

  @Column({ name: 'is_active', default: true })
  isActive: boolean; // Toggle trạng thái (true: hiện, false: ẩn)

  @Column({ name: 'business_license_file', nullable: true })
  businessLicenseFile: string;

  @Column({ name: 'other_document_file', nullable: true })
  otherDocumentFile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; // Ngày tạo bản ghi

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; // Ngày cập nhật cuối cùng

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => User, (user) => user.business)
  users: User[];

  // @Column()
  // level: number;

  // @ManyToOne(() => Business)
  // @JoinColumn({ name: 'parent_id' })
  // parent: Business;
}
