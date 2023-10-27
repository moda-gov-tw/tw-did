import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-ethereum-siwe';
import { NonceService } from './nonce.service';
import { EthereumLoginResponseDto } from '@tw-did/core';

export const ETHEREUM_STRATEGY_NAME = 'ethereum';
@Injectable()
export class EthereumStrategy extends PassportStrategy(Strategy) {
  name: string;

  constructor(private nonceService: NonceService) {
    super({ store: nonceService });
    this.name = ETHEREUM_STRATEGY_NAME;
  }

  async validate(address: string): Promise<EthereumLoginResponseDto> {
    return { address };
  }

  challenge() {
    return this.nonceService.challenge();
  }
}
