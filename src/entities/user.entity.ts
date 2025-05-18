import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Department } from './department.entity';
import { GenderEnum } from '../../libs/shared/ATVSLD/enums/gender.enum';



@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 15, unique: true, nullable: true })
  phone: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Department, (department) => department.users)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column()
  department_id: number; 

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  created_at: Date;
}
