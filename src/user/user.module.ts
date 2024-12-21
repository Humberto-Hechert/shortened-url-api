import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserProvider } from './entities/user.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...UserProvider],
})
export class UserModule {}
