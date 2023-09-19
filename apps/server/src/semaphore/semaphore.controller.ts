import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtAuthGuard } from '../national/jwt-auth.guard';
import { UpdateSemaphoreDto } from './update-semaphore.dto';

@Controller('auth/semaphore')
export class SemaphoreController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() updateSemaphoreDto: UpdateSemaphoreDto) {
    const { id, commitment } = updateSemaphoreDto;
    return this.usersService.updateSemaphoreIdentity(id, commitment);
  }
}
