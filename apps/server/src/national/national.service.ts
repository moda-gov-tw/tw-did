import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

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

  generateJwtPayload(user: User): LoginResponse {
    const payload = { username: user.nationalId, sub: user.id };
    return {
      id: user.id,
      token: this.jwtService.sign(payload),
    };
  }
}
