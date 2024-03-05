import { HttpStatus } from '@nestjs/common';

import { ResponseWithoutData } from '@/types';

export class HttpResponse implements ResponseWithoutData {
  message: string;
  statusCode: HttpStatus;

  constructor(response: ResponseWithoutData) {
    this.message = response.message;
    this.statusCode = response.statusCode;
  }
}
