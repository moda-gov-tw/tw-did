import { Controller, Get } from '@nestjs/common';
import { IssuanceService as IssuanceService } from './issuance.service';

@Controller('issuance')
export class IssuanceController {
  constructor(private issuanceService: IssuanceService) {}

  @Get('issuer')
  getIssuer() {
    return this.issuanceService.getIssuerInfo();
  }
}
