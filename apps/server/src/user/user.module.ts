import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { User, UserSchema } from './user.schema';
import { IssuanceModule } from '../issuance/issuance.module';
import { IssuanceService } from '../issuance/issuance.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Identity, IdentitySchema } from './identity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Identity.name, schema: IdentitySchema },
    ]),
    IssuanceModule,
    ConfigModule,
  ],
  exports: [MongooseModule],
  providers: [IssuanceService, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
