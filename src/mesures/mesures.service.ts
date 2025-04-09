import { Injectable } from '@nestjs/common';
import { CreateMesureDto } from './dto/create-mesure.dto';
import { UpdateMesureDto } from './dto/update-mesure.dto';
import { Course, Mesure, } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MesuresService {

  constructor(private prisma: PrismaService) { }

  async create(createMesureDto: CreateMesureDto) {
    const newMesure: Mesure = await this.prisma.mesure.create({
      data: createMesureDto
    })
    return newMesure;
  }

  async findAll() {
    const mesures: Mesure[] = await this.prisma.mesure.findMany();
    return mesures;
  }

  async findOne(id: number) {
    const mesure: Mesure | null = await this.prisma.mesure.findFirst({
      where: {
        id: id
      }
    })
    return mesure;
  }

  async update(id: number, updateMesureDto: UpdateMesureDto) {
    const updatedMesure: Mesure = await this.prisma.mesure.update({
      where: {
        id: id
      },
      data: updateMesureDto
    });
    return updatedMesure;
  }

  async remove(id: number) {

    const deletedMesure: Mesure = await this.prisma.mesure.delete({
      where: {
        id: id
      }
    })
    return deletedMesure;
  }
}
