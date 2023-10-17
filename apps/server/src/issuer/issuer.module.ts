import { Module } from '@nestjs/common';
import { IssuerService } from './issuer.service';
import { ConfigModule } from '@nestjs/config';
import { IssuerController } from './issuer.controller';

@Module({
  imports: [ConfigModule],
  providers: [IssuerService],
  controllers: [IssuerController],
})
export class IssuerModule {}
