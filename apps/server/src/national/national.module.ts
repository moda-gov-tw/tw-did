import { Module } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { NationalController } from './national.controller';
import { UsersModule } from '../user/user.module';
import { NationalService } from './national.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwFidoStrategy } from './strategies/twfido.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwFidoConfig } from '../config/configuration';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    UsersModule,
    PassportModule,
    ConfigModule,
  ],
  providers: [
    UsersService,
    NationalService,
    JwtStrategy,
    {
      provide: TwFidoStrategy,
      useFactory: async (
        nationalService: NationalService,
        configService: ConfigService
      ) => {
        const options = configService.get<TwFidoConfig>('twfido');
        return new TwFidoStrategy(nationalService, options);
      },
      inject: [NationalService, ConfigService],
    },
  ],
  controllers: [NationalController],
})
export class NationalModule {}
