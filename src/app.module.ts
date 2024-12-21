import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module'; 

@Module({
  imports: [UserModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
