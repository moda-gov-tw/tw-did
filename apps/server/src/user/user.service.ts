import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './create-user.dto';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  findOrCreate(nationalId: string): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { nationalId },
      { nationalId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  updateEthereumAccount(id: string, ethereumAccount: string) {
    return this.userModel.findByIdAndUpdate(id, {
      ethereumAccount,
    });
  }

  updateSemaphoreIdentity(id: string, semaphoreCommitment: string) {
    return this.userModel.findByIdAndUpdate(id, {
      semaphoreCommitment,
    });
  }

  findOne(nationalId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ nationalId });
  }

  findOneById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
