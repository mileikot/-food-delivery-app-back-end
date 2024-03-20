import { MaxFileSizeValidator } from '@nestjs/common';
import { filesize } from 'filesize';

import { MAX_IMAGE_SIZE } from '../../constants';

export const maxFileSizeValidator = new MaxFileSizeValidator({
  maxSize: MAX_IMAGE_SIZE,
  message: `Maximum image size is ${filesize(MAX_IMAGE_SIZE)}`,
});
