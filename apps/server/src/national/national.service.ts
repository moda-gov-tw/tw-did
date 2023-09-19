import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { User, UserDocument } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

export interface LocalUser {
  username: string;
  password: string;
  userId: string;
}

interface LoginResponse {
  token: string;
  id: string;
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

  login(user: UserDocument): LoginResponse {
    const payload = { username: user.nationalId, sub: user._id };
    return {
      id: user._id.toHexString(),
      token: this.jwtService.sign(payload),
    };
  }
}
