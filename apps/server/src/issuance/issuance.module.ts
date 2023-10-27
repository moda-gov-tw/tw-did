import { Module } from '@nestjs/common';
import { IssuanceService } from './issuance.service';
import { ConfigModule } from '@nestjs/config';
import { IssuanceController } from './issuance.controller';

@Module({
  imports: [ConfigModule],
  providers: [IssuanceService],
  controllers: [IssuanceController],
})
export class IssuanceModule {}
