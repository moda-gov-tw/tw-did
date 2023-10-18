import { Controller, Get } from '@nestjs/common';
import { IssuerService } from './issuer.service';

@Controller('issuer')
export class IssuerController {
  constructor(private issuerService: IssuerService) {}

  @Get()
  getIssuer() {
    return this.issuerService.getIssuerInfo();
  }
}
