import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/user.schema';

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
    const payload = { username: user.nationalId, sub: user._id.toHexString() };
    return {
      id: user.id,
      token: this.jwtService.sign(payload),
    };
  }
}
