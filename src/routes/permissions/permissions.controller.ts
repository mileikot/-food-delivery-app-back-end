import { Get, Injectable, Param } from '@nestjs/common';

import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.permissionsService.findOneById(+id);
  }
}
