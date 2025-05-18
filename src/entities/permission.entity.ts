import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { RolePermission } from './role-permission.entity';
// import { PermissionEnum } from 'libs/shared/ATVSLD/enums/permission.enum';

export enum PermissionEnum {
  GROUP = 'Group',
  COMPONENT = 'Component',
}


@Entity('permissions')
export class Permission {
  

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: PermissionEnum })
  type: PermissionEnum;


  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions: RolePermission[];

  @CreateDateColumn()
  created_at: Date;
}

