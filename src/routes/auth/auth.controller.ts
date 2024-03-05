import { Body, Controller, Post } from '@nestjs/common';

import { LoginManagerDto } from './dto/login-manager.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login-user')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Public()
  @Post('login-manager')
  loginManager(@Body() loginManagerDto: LoginManagerDto) {
    return this.authService.loginManager(loginManagerDto);
  }
}
