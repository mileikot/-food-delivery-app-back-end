import { SNSClient } from '@aws-sdk/client-sns';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClientSnsService } from './client-sns.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SNSClient,
      useFactory: (configService: ConfigService) =>
        new SNSClient({
          credentials: {
            accessKeyId: configService.get('ACCESS_KEY')!,
            secretAccessKey: configService.get('SECRET_ACCESS_KEY')!,
          },
          region: configService.get('BUCKET_REGION'),
        }),
      inject: [ConfigService],
    },
    ClientSnsService,
  ],
  exports: [ClientSnsService],
})
export class ClientSnsModule {}
