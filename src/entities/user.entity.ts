import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Business } from './business.entity';
import { GenderEnum } from '../../libs/shared/ATVSLD/enums/gender.enum';
import { UserTypeEnum } from '../../libs/shared/ATVSLD/enums/user-type.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account', length: 50, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ name: 'job_title', length: 100, nullable: true })
  jobTitle: string;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ name: 'user_type', type: 'enum', enum: UserTypeEnum })
  userType: UserTypeEnum;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ name: 'phone', length: 15, unique: true, nullable: true })
  phoneNumber: string;

  @Column({ length: 100, nullable: true })
  province: string;

  @Column({ length: 100, nullable: true })
  district: string;

  @Column({ length: 100, nullable: true })
  ward: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', nullable: true })
  roleId: string;

  @ManyToOne(() => Business, (business) => business.users)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ name: 'business_id', nullable: true })
  businessId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
