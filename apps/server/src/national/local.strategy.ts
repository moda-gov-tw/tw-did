import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NationalService } from './national.service';
import { User } from '../user/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private nationalService: NationalService) {
    super();
  }

  async validate(nationalId: string): Promise<User> {
    const user = await this.nationalService.validateUser(nationalId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
