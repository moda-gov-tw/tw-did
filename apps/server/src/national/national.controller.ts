import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { NationalService } from './national.service';
import { RegisterNationalDto } from './register-national.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../user/create-user.dto';

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
    const createUserDto: CreateUserDto = { nationalId };
    const user = await this.usersService.createUnique(createUserDto);
    return this.nationalService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  check(@Request() req) {
    const { user } = req;
    return { user };
  }
}
