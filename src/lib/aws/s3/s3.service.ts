import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectsCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

import { RequestPresigningArguments, S3Target } from './types';

import { DeleteMultipleObjectsCommandInput } from '@/modules/aws';

@Injectable()
export class S3 implements S3Target {
  private s3: S3Client;

  constructor(config?: S3ClientConfig) {
    this.s3 = new S3Client(config ?? {});
  }

  get(input: GetObjectCommandInput) {
    try {
      return this.s3.send(new GetObjectCommand(input));
    } catch (error) {
      throw new Error(error);
    }
  }

  put(input: PutObjectCommandInput) {
    try {
      return this.s3.send(new PutObjectCommand(input));
    } catch (error) {
      throw new Error(error);
    }
  }

  delete(input: DeleteObjectCommandInput) {
    try {
      return this.s3.send(new DeleteObjectCommand(input));
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteMultiple(input: DeleteMultipleObjectsCommandInput) {
    const { Bucket, Prefix, Delete, ...restInputProps } = input;

    try {
      const list = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: Bucket,
          Prefix: Prefix,
        }),
      );

      if (list.KeyCount && list.Contents) {
        return this.s3.send(
          new DeleteObjectsCommand({
            Bucket,
            Delete: {
              Objects: list.Contents.map((item) => ({ Key: item.Key })),
              Quiet: false,
              ...Delete,
            },
            ...restInputProps,
          }),
        );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  getSignedUrl(
    input: GetObjectCommandInput,
    options?: RequestPresigningArguments,
  ) {
    return getS3SignedUrl(this.s3, new GetObjectCommand(input), options);
  }
}
