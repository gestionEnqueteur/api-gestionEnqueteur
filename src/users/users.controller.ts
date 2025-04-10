import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    const users = await  this.usersService.findAll();
    return users.map(item => plainToInstance(UserEntity, item)); 
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user: User | null =  await this.usersService.findOne(username);
    if (!user)
      throw new NotFoundException(); 

    // remove the sensitive data before send the request
    return plainToInstance(UserEntity, user);
  }

  @Patch(':username')
  async update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(username, updateUserDto);
    return plainToInstance(UserEntity, user )
  }

  @Delete(':username')
  async remove(@Param('username') username: string) {
    const deletedUser = await this.usersService.remove(username);
    return plainToInstance(UserEntity, deletedUser); 
  }
}
