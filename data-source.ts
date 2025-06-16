// data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Business } from './src/entities/business.entity';
import { Role } from './src/entities/role.entity';
import { User } from './src/entities/user.entity';
import { Permission } from './src/entities/permission.entity';
import { RolePermission } from './src/entities/role-permission.entity';
import { UserToken } from './src/entities/user-token.entity';
import { PasswordReset } from './src/entities/password-reset.entity';
import { ReportInstance } from './src/entities/report-instance.entity';
import { ReportConfiguration } from './src/entities/report-configuration.entity';
import { ReportDetail } from './src/entities/report-detail.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '3008',
  database: 'atvsld_dev',
  entities: [
    Business,
    Role,
    User,
    Permission,
    RolePermission,
    UserToken,
    PasswordReset,
    ReportConfiguration,
    ReportInstance,
    ReportDetail, // Assuming ReportDetail is defined in your entities
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
