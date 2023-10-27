import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EthereumStrategy } from './ethereum.strategy';
import { JwtAuthGuard } from '../national/guards/jwt-auth.guard';
import { EthereumAuthGuard } from './ethereum-auth.guard';
import { UsersService } from '../user/user.service';
import { EthereumLoginDto, NonceDto } from '@tw-did/core';

@Controller('auth/ethereum')
export class EthereumController {
  constructor(
    private ethereumStrategy: EthereumStrategy,
    private usersService: UsersService
  ) {}

  @UseGuards(EthereumAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Req() req, @Body() loginDto: EthereumLoginDto) {
    const { id, account } = loginDto;
    await this.usersService.updateEthereumAccount(id, account);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('challenge')
  challenge(): Promise<NonceDto> {
    return this.ethereumStrategy.challenge();
  }
}
