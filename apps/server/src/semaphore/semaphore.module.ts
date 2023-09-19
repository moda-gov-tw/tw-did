import { Module } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service';
import { SemaphoreController } from './semaphore.controller';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [SemaphoreController],
})
export class SemaphoreModule {}
