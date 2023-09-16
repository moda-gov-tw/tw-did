import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Nonce } from './nonce.schema';
import { VerifyNonceDto } from './verify-nonce.dto';
import { NotFoundException } from '@nestjs/common';
import { getRandomHexString } from '../utils';

export class AuthService {
  constructor(@InjectModel(Nonce.name) private nonceModel: Model<Nonce>) {}

  challenge(): Promise<Nonce> {
    const nonce = new this.nonceModel();
    nonce.value = getRandomHexString();
    return nonce.save();
  }

  async verify(verifyNonceDto: VerifyNonceDto): Promise<boolean> {
    const nonce = await this.nonceModel
      .findOneAndDelete({ value: verifyNonceDto.value })
      .exec();

    if (!nonce) {
      throw new NotFoundException('Nonce not found');
    }

    return true;
  }
}
