import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientSnsService {
  constructor(private snsClient: SNSClient) {}

  sendSms({ phoneNumber }: { phoneNumber: string }, code: string) {
    const command = new PublishCommand({
      Message: `Your OTP code is ${code}`,
      PhoneNumber: phoneNumber,
    });

    return this.snsClient.send(command);
  }
}
