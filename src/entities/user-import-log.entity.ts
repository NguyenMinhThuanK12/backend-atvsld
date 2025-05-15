import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_import_logs')
export class UserImportLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  file_name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'imported_by' })
  imported_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  imported_at: Date;

  @Column('text')
  status: string;
}
