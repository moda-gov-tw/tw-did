import {
  Controller,
  Request,
  Get,
  Param,
  Post,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../national/guards/jwt-auth.guard';
import { User } from './user.schema';
import { IssuanceService } from '../issuance/issuance.service';
import { VerifiableCredential } from '@veramo/core-types';
import { IdentityDocument } from './identity.schema';

interface RevocationResult {
  result: boolean;
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private issuanceService: IssuanceService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('commitments')
  findAllCommitments(): Promise<string[]> {
    return this.usersService.findAllCommitments();
  }

  @Get('revocation')
  getRevocation() {
    return this.usersService.findAllRevocation();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOneById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('credential')
  async createCredential(@Request() req): Promise<VerifiableCredential> {
    const { userId } = req.user;
    const user = await this.usersService.findOneById(userId);
    if (!user.currentIdentity) {
      throw new NotFoundException(
        `the currentIdentity of User ${user._id} not found`
      );
    }

    const identityId = (user.currentIdentity as IdentityDocument)._id;

    return this.issuanceService.signEthereumVerifiableCredential(
      user._id.toHexString(),
      identityId.toHexString(),
      user.currentIdentity.ethereumAccount
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke')
  async revokeIdentity(@Request() req): Promise<RevocationResult> {
    const { userId } = req.user;
    const result = await this.usersService.revokeIdentity(userId);
    return { result };
  }
}
