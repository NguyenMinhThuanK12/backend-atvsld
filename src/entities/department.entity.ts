import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column()
  level: number;

  @Column({ length: 50, nullable: true })
  province: string;

  @Column({ length: 50, nullable: true })
  district: string;

  @Column({ length: 50, nullable: true })
  ward: string;

  @Column({ nullable: true })
  parent_id: number;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'parent_id' })
  parent: Department;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @OneToMany(() => Role, (role) => role.department)
  roles: Role[];
}
