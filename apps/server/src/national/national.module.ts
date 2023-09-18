import { Module } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { NationalController } from './national.controller';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [NationalController],
})
export class NationalModule {}
