import {
  DeleteObjectCommandInput,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';

import { DeleteMultipleObjectsCommandInput } from '@/modules/aws';

export class S3Target {
  get: (input: GetObjectCommandInput) => void;
  put: (input: PutObjectCommandInput) => void;
  delete: (input: DeleteObjectCommandInput) => void;
  getSignedUrl: (input: GetObjectCommandInput) => Promise<string>;
  deleteMultiple: (input: DeleteMultipleObjectsCommandInput) => void;
}

export interface RequestPresigningArguments {
  expiresIn?: number;
}
