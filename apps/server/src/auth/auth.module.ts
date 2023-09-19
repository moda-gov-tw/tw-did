import { Module } from '@nestjs/common';
import { NationalModule } from '../national/national.module';
import { EthereumModule } from '../ethereum/ethereum.module';
import { SemaphoreModule } from '../semaphore/semaphore.module';

@Module({
  imports: [NationalModule, EthereumModule, SemaphoreModule],
  providers: [],
  controllers: [],
})
export class AuthModule {}
