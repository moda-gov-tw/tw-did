import { createHash } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Identity, IdentityDocument } from './identity.schema';
import { CommitmentsDto } from '@tw-did/core';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Identity.name) private identityModel: Model<Identity>
  ) {}

  async findOneById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .populate('currentIdentity')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findAllCommitments(): Promise<CommitmentsDto> {
    const allIdentities = await this.identityModel.find().exec();

    const activated: string[] = [];
    const revoked: string[] = [];

    for (const identity of allIdentities) {
      if (identity.revoked) {
        revoked.push(identity.semaphoreCommitment);
      } else {
        activated.push(identity.semaphoreCommitment);
      }
    }

    return {
      activated,
      revoked,
    };
  }

  async findAllRevocation(): Promise<string[]> {
    const revokedIdentities = await this.identityModel
      .find({ revoked: true })
      .select('_id')
      .exec();

    return revokedIdentities.map((identity) => identity._id.toHexString());
  }

  async findOrCreate(nationalId: string): Promise<UserDocument> {
    const hashFunc = createHash('sha256');
    const hashedNationalId = hashFunc.update(nationalId).digest('hex');
    return this.userModel.findOneAndUpdate(
      { hashedNationalId },
      { hashedNationalId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  private async updateIdentity(
    userId: string,
    field: 'ethereumAccount' | 'semaphoreCommitment',
    value: string
  ) {
    const user = await this.findOneById(userId);
    if (!user.currentIdentity) {
      const createdIdentity = new this.identityModel({
        userId,
        [field]: value,
      });
      await createdIdentity.save();
      user.currentIdentity = createdIdentity;
      await user.save();
    } else {
      const identityId = (user.currentIdentity as IdentityDocument)._id;
      const identity = await this.identityModel.findById(identityId);
      if (identity) {
        identity[field] = value;
        await identity.save();
      }
    }
  }

  updateEthereumAccount(userId: string, value: string) {
    return this.updateIdentity(userId, 'ethereumAccount', value);
  }

  updateSemaphoreIdentity(userId: string, value: string) {
    return this.updateIdentity(userId, 'semaphoreCommitment', value);
  }

  findOne(hashedNationalId: string): Promise<User | null> {
    return this.userModel.findOne({ hashedNationalId });
  }

  async revokeIdentity(userId: string): Promise<boolean> {
    const user = await this.findOneById(userId);
    if (!user.currentIdentity) {
      throw new NotFoundException(
        `the currentIdentity of User ${user._id} not found`
      );
    }

    const identityId = (user.currentIdentity as IdentityDocument)._id;
    const identity = await this.identityModel.findById(identityId);
    if (identity) {
      identity.revoked = true;
      await identity.save();
      user.currentIdentity = null;
      await user.save();
      return true;
    } else {
      return false;
    }
  }
}
