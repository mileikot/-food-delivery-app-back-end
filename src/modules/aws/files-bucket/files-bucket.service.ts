import {
  DeleteObjectCommandInput,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeleteMultipleObjectsCommandInput } from './types';

import { S3, S3Target } from '@/lib/aws';

@Injectable()
export class FilesBucketService implements S3Target {
  private bucketName: string;

  constructor(
    private s3: S3,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('BUCKET_NAME')!;
  }

  get(input: Omit<GetObjectCommandInput, 'Bucket'>) {
    return this.s3.get({
      ...input,
      Bucket: this.bucketName,
    });
  }

  put(input: Omit<PutObjectCommandInput, 'Bucket'>) {
    return this.s3.put({
      ...input,
      Bucket: this.bucketName,
    });
  }

  delete(input: Omit<DeleteObjectCommandInput, 'Bucket'>) {
    return this.s3.delete({
      ...input,
      Bucket: this.bucketName,
    });
  }

  deleteMultiple(input: Omit<DeleteMultipleObjectsCommandInput, 'Bucket'>) {
    return this.s3.deleteMultiple({
      ...input,
      Bucket: this.bucketName,
    });
  }

  getSignedUrl(input: Omit<GetObjectCommandInput, 'Bucket'>) {
    return this.s3.getSignedUrl(
      {
        ...input,
        Bucket: this.bucketName,
      },
      {
        expiresIn: 3600,
      },
    );
  }
}
