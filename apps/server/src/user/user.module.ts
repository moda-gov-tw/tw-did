import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IssuerModule } from '../issuer/issuer.module';
import { IssuerService } from '../issuer/issuer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), IssuerModule, ConfigModule],
  exports: [TypeOrmModule],
  providers: [IssuerService, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
