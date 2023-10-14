import { Module } from '@nestjs/common';
import { EthereumStrategy } from './ethereum.strategy';
import { EthereumController } from './ethereum.controller';
import { NonceService } from './nonce.service';
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service';
import { Nonce } from './nonce.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Nonce]), UsersModule],
  exports: [TypeOrmModule],
  providers: [UsersService, NonceService, EthereumStrategy],
  controllers: [EthereumController],
})
export class EthereumModule {}
