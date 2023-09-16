import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.schema';
import { UsersService } from './user.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
