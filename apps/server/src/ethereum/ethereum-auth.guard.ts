import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ETHEREUM_STRATEGY_NAME } from './ethereum.strategy';

@Injectable()
export class EthereumAuthGuard extends AuthGuard(ETHEREUM_STRATEGY_NAME) {}
