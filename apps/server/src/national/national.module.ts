import { Module } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { NationalController } from './national.controller';
import { UsersModule } from '../user/user.module';
import { NationalService } from './national.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    UsersModule,
    PassportModule,
  ],
  providers: [UsersService, NationalService, LocalStrategy, JwtStrategy],
  controllers: [NationalController],
})
export class NationalModule {}
