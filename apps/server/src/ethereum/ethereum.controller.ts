import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EthereumStrategy } from './ethereum.strategy';
import { JwtAuthGuard } from '../national/guards/jwt-auth.guard';
import { EthereumAuthGuard } from './ethereum-auth.guard';
import { LoginEthereumDto } from './login-ethereum.dto';
import { UsersService } from '../user/user.service';

@Controller('auth/ethereum')
export class EthereumController {
  constructor(
    private ethereumStrategy: EthereumStrategy,
    private usersService: UsersService
  ) {}

  @UseGuards(EthereumAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Req() req, @Body() loginDto: LoginEthereumDto) {
    const { id, account } = loginDto;
    await this.usersService.updateEthereumAccount(id, account);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('challenge')
  challenge() {
    return this.ethereumStrategy.challenge();
  }
}
