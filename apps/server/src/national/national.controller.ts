import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { NationalService } from './national.service';
import { RequestLoginDto } from './request-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TwFidoAuthGuard } from './guards/twfido-auth.guard';
import { TwFidoStrategy } from './strategies/twfido.strategy';

@Controller('auth/national')
export class NationalController {
  constructor(
    private twfidoStrategy: TwFidoStrategy,
    private usersService: UsersService,
    private nationalService: NationalService
  ) {}

  @Post('request-login')
  requestLogin(@Body() requestLoginDto: RequestLoginDto) {
    const { nationalId, method } = requestLoginDto;
    return this.twfidoStrategy.requestLogin(nationalId, method);
  }

  @UseGuards(TwFidoAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { nationalId } = req.user;
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
