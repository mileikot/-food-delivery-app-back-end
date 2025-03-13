import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Public } from '../auth/decorators';
import { ManagerAuthGuard } from '../auth/guards';

import { CreateManagerDto } from './dto/create-manager.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagersService } from './managers.service';

import { RequestWithUser } from '@/types';

@Controller('managers')
@UseGuards(ManagerAuthGuard)
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  @Public()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  findAll() {
    return this.managersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managersService.findOneById(+id);
  }

  @Patch('/reset-password')
  resetPassword(
    @Req() request: RequestWithUser,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    // return this.managersService.resetPassword(
    //   request.managerId,
    //   resetPasswordDto,
    // ); TO DO - remove
    return null;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateManagerDto: UpdateManagerDto,
  ) {
    return this.managersService.update(+id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managersService.remove(+id);
  }
}
