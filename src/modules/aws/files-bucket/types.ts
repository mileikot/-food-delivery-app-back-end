import { DeleteObjectsCommandInput } from '@aws-sdk/client-s3';

export interface DeleteMultipleObjectsCommandInput
  extends Partial<DeleteObjectsCommandInput> {
  Prefix: string;
}
