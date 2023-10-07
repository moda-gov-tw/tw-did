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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TwFidoAuthGuard } from './guards/twfido-auth.guard';

@Controller('auth/national')
export class NationalController {
  constructor(
    private usersService: UsersService,
    private nationalService: NationalService
  ) {}

  @UseGuards(TwFidoAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { nationalId } = req.user;
    const user = await this.usersService.findOrCreate(nationalId);
    return this.nationalService.generateJwtPayload(user);
  }

  @UseGuards(TwFidoAuthGuard)
  @Post('register')
  async register(@Body() registerNationalDto: RegisterNationalDto) {
    const { nationalId } = registerNationalDto;
    const user = await this.usersService.findOrCreate(nationalId);
    return this.nationalService.generateJwtPayload(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  check(@Request() req) {
    const { user } = req;
    return { user };
  }
}
