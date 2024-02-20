import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { FilesBucketService } from '@/modules/aws';

@Injectable()
export class FilesService {
  constructor(private readonly filesBucketService: FilesBucketService) {}

  public async saveFile(
    id: number,
    file: Buffer,
    previousName?: string | null,
  ) {
    const { fileName } = await this.saveImageToBucket(id, file, previousName);

    const fileURL = await this.getFileURL(id, fileName);

    return { fileURL, fileName };
  }

  public deleteFiles(id: number) {
    return this.filesBucketService.deleteMultiple({
      Prefix: `${id}`,
    });
  }

  public getFileURL(id: number, name: string | null): Promise<string> | string {
    if (!name) return '';

    return this.filesBucketService.getSignedUrl({
      Key: `${id}/${name}`,
    });
  }

  private async saveImageToBucket(
    id: number,
    file: Buffer,
    previousName?: string | null,
  ) {
    let fileName: string | null = null;

    if (previousName) {
      fileName = previousName;
    } else {
      fileName = this.randomFileName();
    }

    await this.filesBucketService.put({
      Key: `${id}/${fileName}`,
      Body: file,
    });

    return { fileName };
  }

  private randomFileName(bytes: number = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }
}
