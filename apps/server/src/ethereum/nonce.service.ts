import { Injectable, NotFoundException } from '@nestjs/common';
import { getRandomHexString } from '../utils';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Nonce } from './nonce.entity';
import { Repository } from 'typeorm';

type Callback<T> = (
  error: Error | null,
  result?: T,
  info?: { message: string }
) => void;

@Injectable()
export class NonceService {
  constructor(
    @InjectRepository(Nonce) private nonceRepository: Repository<Nonce>
  ) {}

  challenge(): Promise<Nonce> {
    const nonce = this.nonceRepository.create();
    nonce.value = getRandomHexString();
    return this.nonceRepository.save(nonce);
  }

  async verify(_req: Request, nonceValue: string, cb?: Callback<boolean>) {
    const nonce = await this.nonceRepository.findOne({
      where: { value: nonceValue },
    });

    // this callback is for compatible of passport-siwe
    if (!nonce) {
      const error = new NotFoundException(
        `Nonce with value ${nonceValue} not found`
      );
      if (cb) {
        cb(error, false);
      }
      throw error;
    }

    await this.nonceRepository.remove(nonce);

    if (cb) {
      cb(null, true);
    }
    return true;
  }
}
