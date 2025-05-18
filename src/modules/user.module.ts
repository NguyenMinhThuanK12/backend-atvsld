import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user/user.repository';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: 'IUserRepository', 
      useClass: UserRepository,
    },
  ],
  exports: ['IUserRepository'], 
})
export class UserModule {}
