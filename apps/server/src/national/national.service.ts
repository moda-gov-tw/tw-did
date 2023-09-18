import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

export interface LocalUser {
  username: string;
  password: string;
  userId: string;
}

interface JwtToken {
  access_token: string;
}

@Injectable()
export class NationalService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  validateUser(nationalId: string): Promise<User | null> {
    return this.usersService.findOne(nationalId);
  }

  login({ username, userId }: LocalUser): JwtToken {
    const payload = { username, sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
