import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientSnsService {
  private client: SNSClient;

  constructor(private configService: ConfigService) {
    this.client = new SNSClient({
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY')!,
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY')!,
      },
      region: this.configService.get('BUCKET_REGION'),
    });
  }

  sendSms({ phoneNumber }: { phoneNumber: string }, code: string) {
    const command = new PublishCommand({
      Message: `Your OTP code is ${code}`,
      PhoneNumber: phoneNumber,
    });

    return this.client.send(command);
  }
}
