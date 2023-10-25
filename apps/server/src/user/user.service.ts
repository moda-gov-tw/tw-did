import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(nationalId: string): Promise<User> {
    const createdUser = new this.userModel({ nationalId });
    return createdUser.save();
  }

  async findOneById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findAllCommitments(): Promise<string[]> {
    const users = await this.userModel
      .find({
        semaphoreCommitment: { $exists: true, $ne: null },
      })
      .select('semaphoreCommitment')
      .exec();
    return users.map((user) => user.semaphoreCommitment);
  }

  async findOrCreate(nationalId: string): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { nationalId },
      { nationalId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async updateEthereumAccount(id: string, ethereumAccount: string) {
    return this.userModel.findByIdAndUpdate(id, {
      ethereumAccount,
    });
  }

  async updateSemaphoreIdentity(id: string, semaphoreCommitment: string) {
    return this.userModel.findByIdAndUpdate(id, {
      semaphoreCommitment,
    });
  }

  findOne(nationalId: string): Promise<User | null> {
    return this.userModel.findOne({ nationalId });
  }
}
