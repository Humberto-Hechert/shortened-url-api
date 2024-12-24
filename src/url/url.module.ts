import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UrlProvider } from './entities/url.provider';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, UserModule, JwtModule],
  controllers: [UrlController],
  providers: [...UrlProvider, UrlService, AuthService],
})
export class UrlModule {}
