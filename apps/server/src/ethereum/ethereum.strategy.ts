import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-ethereum-siwe';
import { NonceService } from './nonce.service';

@Injectable()
export class EthereumStrategy extends PassportStrategy(Strategy) {
  name: string;

  constructor(private nonceService: NonceService) {
    super({ store: nonceService });
    this.name = 'ethereum';
  }

  async validate(address: string): Promise<{ address: string }> {
    return { address };
  }

  challenge() {
    return this.nonceService.challenge();
  }
}

export const ETHEREUM_STRATEGY_NAME = 'ethereum';
