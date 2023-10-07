import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { UserDocument } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

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

  generateJwtPayload(user: UserDocument): LoginResponse {
    const payload = { username: user.nationalId, sub: user._id };
    return {
      id: user._id.toHexString(),
      token: this.jwtService.sign(payload),
    };
  }
}
