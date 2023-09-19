import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from './user.schema';
import { UsersService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from '../national/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOneById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOneById(id);
  }
}
