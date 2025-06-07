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

  @Column({ length: 50, unique: true })
  account: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 100, nullable: true })
  job_title: string;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ type: 'enum', enum: UserTypeEnum })
  user_type: UserTypeEnum;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 15, unique: true, nullable: true })
  phone: string;

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

  @Column({ nullable: true }) // hoặc bỏ nếu bạn cần required
  role_id: string;

  @ManyToOne(() => Business, (business) => business.users)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ nullable: true })
  business_id: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
