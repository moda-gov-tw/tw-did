import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { VerifyUserNationIdDto } from '../user/verify-user.dto';

@Controller('auth/national')
export class NationalController {
  constructor(private usersService: UsersService) {}

  @Post('verify')
  async verify(
    @Body() verifyNationId: VerifyUserNationIdDto
  ): Promise<boolean> {
    if (verifyNationId.createUserIfNotExist) {
      await this.usersService.findOrCreate(verifyNationId.nationalId);
    }

    return true;
  }
}
