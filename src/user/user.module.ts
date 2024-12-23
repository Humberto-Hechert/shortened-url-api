import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserProvider } from './entities/user.provider';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...UserProvider, UserService],
})
export class UserModule {}
