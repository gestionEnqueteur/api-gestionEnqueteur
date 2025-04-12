import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {

    const newUser: User = await this.prisma.user.create({
      data: createUserDto
    }); 
    return newUser;
  }

  async findAll() {
    const users: User[] = await this.prisma.user.findMany(); 
    return users;
  }

  async findOne(id: number) {

    const user: User | null = await this.prisma.user.findFirst({
      where: {
        id: id
      }
    }); 
    return user;
  }

  async findOneByUsername(username: string) {
    const user: User | null = await this.prisma.user.findFirst({
      where: {
        username: username,
      }
    }); 
    return user; 
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser: User = await this.prisma.user.update({
      where: {
        id: id
      }, 
      data: updateUserDto
    }); 
    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser: User = await this.prisma.user.delete({
      where: {
        id: id
      }
    }); 
    return deletedUser;
  }
}
