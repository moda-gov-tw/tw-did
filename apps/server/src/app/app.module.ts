import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../user/user.module';
import { Config, getConfig } from '../config/configuration';
import { AuthModule } from '../auth/auth.module';
import { join } from 'path';
import { existsSync } from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      load: [getConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<Config>('mongo.host');
        const database = configService.get<Config>('mongo.database');
        const username = configService.get<Config>('mongo.username');
        const password = configService.get<Config>('mongo.password');
        return {
          uri: `mongodb://${username}:${password}@${host}/${database}`,
        };
      },
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
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
