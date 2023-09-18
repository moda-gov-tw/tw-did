import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ETHEREUM_STRATEGY_NAME, EthereumStrategy } from './ethereum.strategy';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../national/jwt-auth.guard';

@Controller('auth/ethereum')
export class EthereumController {
  constructor(private ethereumStrategy: EthereumStrategy) {}

  @UseGuards(JwtAuthGuard)
  @Post('login')
  @UseGuards(AuthGuard(ETHEREUM_STRATEGY_NAME))
  login(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('challenge')
  challenge() {
    return this.ethereumStrategy.challenge();
  }
}
