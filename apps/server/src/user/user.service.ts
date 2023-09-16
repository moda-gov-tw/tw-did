import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './create-user.dto';
import { Model } from 'mongoose';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async onModuleInit() {
    const count = await this.userModel.count();
    if (count === 0) {
      const dto: CreateUserDto = { nationalId: 'A123456789' };
      return this.create(dto);
    }
  }
}
