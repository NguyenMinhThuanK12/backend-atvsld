import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('user_tokens')
  export class UserToken {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    user: User;
  
    @Column('text')
    refresh_token: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @Column({ type: 'timestamp' })
    expires_at: Date;
  }
  