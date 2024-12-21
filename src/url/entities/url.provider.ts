import { DataSource } from 'typeorm';
import { Url } from './url.entity'

export const UrlProvider = [
  {
    provide: 'SHORTENEDURL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Url),
    inject: ['DATA_SOURCE'],
  },
];
