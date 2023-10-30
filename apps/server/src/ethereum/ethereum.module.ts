import { Module } from '@nestjs/common';
import { EthereumStrategy } from './ethereum.strategy';
import { EthereumController } from './ethereum.controller';
import { NonceService } from './nonce.service';
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service';
import { Nonce, NonceSchema } from './nonce.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nonce.name, schema: NonceSchema }]),
    UsersModule,
  ],
  exports: [MongooseModule],
  providers: [UsersService, NonceService, EthereumStrategy],
  controllers: [EthereumController],
})
export class EthereumModule {}
