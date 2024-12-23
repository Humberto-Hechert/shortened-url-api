import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module'; 
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, UrlModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
