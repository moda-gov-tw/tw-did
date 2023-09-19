import { Module } from '@nestjs/common';
import { EthereumStrategy } from './ethereum.strategy';
import { EthereumController } from './ethereum.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Nonce, NonceSchema } from './nonce.schema';
import { NonceService } from './nonce.service';
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nonce.name, schema: NonceSchema }]),
    UsersModule,
  ],
  providers: [UsersService, NonceService, EthereumStrategy],
  controllers: [EthereumController],
})
export class EthereumModule {}
