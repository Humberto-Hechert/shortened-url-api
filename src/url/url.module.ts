import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UrlProvider } from './entities/url.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...UrlProvider],
})
export class UrlModule {}
