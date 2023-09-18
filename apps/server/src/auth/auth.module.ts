import { Module } from '@nestjs/common';
import { NationalModule } from '../national/national.module';
import { EthereumModule } from '../ethereum/ethereum.module';

@Module({
  imports: [NationalModule, EthereumModule],
  providers: [],
  controllers: [],
})
export class AuthModule {}
