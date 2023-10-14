import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  create(nationalId: string): Promise<User> {
    const id = uuid();
    const createdUser = this.usersRepository.create({ id, nationalId });
    return this.usersRepository.save(createdUser);
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findAllCommitments(): Promise<string[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      where: { semaphoreCommitment: { $exists: true, $ne: null } },
    };
    const users = await this.usersRepository.find(query);
    return users.map((user) => user.semaphoreCommitment);
  }

  async findOrCreate(nationalId: string): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { nationalId } });

    if (!user) {
      user = await this.create(nationalId);
    }

    return user;
  }

  async updateEthereumAccount(id: string, ethereumAccount: string) {
    const user = await this.findOneById(id);
    user.ethereumAccount = ethereumAccount;
    await this.usersRepository.save(user);

    return user;
  }

  async updateSemaphoreIdentity(id: string, semaphoreCommitment: string) {
    const user = await this.findOneById(id);
    user.semaphoreCommitment = semaphoreCommitment;
    await this.usersRepository.save(user);

    return user;
  }

  findOne(nationalId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { nationalId } });
  }
}
