import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClientSnsService } from './client-sns.service';

@Module({
  imports: [ConfigModule],
  providers: [ClientSnsService],
  exports: [ClientSnsService],
})
export class ClientSnsModule {}
