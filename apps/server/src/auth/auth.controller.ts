import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ETHEREUM_STRATEGY_NAME, EthereumStrategy } from './ethereum.strategy';

@Controller('auth')
export class AuthController {
  constructor(private ethereumStrategy: EthereumStrategy) {}

  @Post('login')
  @UseGuards(AuthGuard(ETHEREUM_STRATEGY_NAME))
  login(@Req() req) {
    return req.user;
  }

  @Post('challenge')
  challenge() {
    return this.ethereumStrategy.challenge();
  }
}
