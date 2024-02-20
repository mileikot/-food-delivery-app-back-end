import { Module } from '@nestjs/common';

import { FilesService } from './files.service';

import { FilesBucketModule } from '@/modules/aws';

@Module({
  imports: [FilesBucketModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
