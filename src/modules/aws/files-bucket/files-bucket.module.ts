import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FilesBucketService } from './files-bucket.service';

import { S3 } from '@/lib/aws';

@Module({
  providers: [
    {
      provide: S3,
      useFactory: (configService: ConfigService) =>
        new S3({
          credentials: {
            accessKeyId: configService.get('ACCESS_KEY')!,
            secretAccessKey: configService.get('SECRET_ACCESS_KEY')!,
          },
          region: configService.get('BUCKET_REGION'),
        }),
      inject: [ConfigService],
    },
    FilesBucketService,
  ],
  imports: [ConfigModule],
  exports: [FilesBucketService],
})
export class FilesBucketModule {}
