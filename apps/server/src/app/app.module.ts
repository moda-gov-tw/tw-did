import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../user/user.module';
import { MongoConfig, getConfig } from '../config/configuration';
import { AuthModule } from '../auth/auth.module';
import { join } from 'path';
import { existsSync } from 'fs';
import { IssuanceModule } from '../issuance/issuance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      load: [getConfig],
    }),

    ServeStaticModule.forRootAsync({
      useFactory: () => {
        const clientPath = join(__dirname, '..', 'web');

        if (existsSync(clientPath)) {
          return [
            {
              rootPath: clientPath,
            },
          ];
        } else {
          return [];
        }
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, database, username, password } =
          configService.get<MongoConfig>('mongo');
        const type = 'mongodb';
        const synchronize = true;

        return {
          type,
          host,
          username,
          password,
          database,
          synchronize,
          autoLoadEntities: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    IssuanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
