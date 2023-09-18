import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { LocalUser, NationalService } from './national.service';
import { RegisterNationalDto } from './register-national.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth/national')
export class NationalController {
  constructor(
    private usersService: UsersService,
    private nationalService: NationalService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.nationalService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerNationalDto: RegisterNationalDto) {
    const nationalId = registerNationalDto.username;
    await this.usersService.findOrCreate(nationalId);
    const { username, password } = registerNationalDto;
    const localUser: LocalUser = { username, password, userId: username };
    return this.nationalService.login(localUser);
  }
}
