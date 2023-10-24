import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IssuanceModule } from '../issuance/issuance.module';
import { IssuanceService } from '../issuance/issuance.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), IssuanceModule, ConfigModule],
  exports: [TypeOrmModule],
  providers: [IssuanceService, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
