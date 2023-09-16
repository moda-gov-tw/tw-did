import { Module } from '@nestjs/common';
import { NonceService } from './nonce.service';
import { EthereumStrategy } from './ethereum.strategy';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Nonce, NonceSchema } from './nonce.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nonce.name, schema: NonceSchema }]),
  ],
  providers: [NonceService, EthereumStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
