import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ETHEREUM_STRATEGY_NAME, EthereumStrategy } from './ethereum.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/ethereum')
export class EthereumController {
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
