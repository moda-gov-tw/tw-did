import { Module } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { NationalController } from './national.controller';
import { UsersModule } from '../user/user.module';
import { NationalService } from './national.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
    PassportModule,
  ],
  providers: [UsersService, NationalService, LocalStrategy, JwtStrategy],
  controllers: [NationalController],
})
export class NationalModule {}