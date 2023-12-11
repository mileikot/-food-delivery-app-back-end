import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  ],
  imports: [ConfigModule],
  exports: [S3],
})
export class FilesBucketModule {}
