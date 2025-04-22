import { Injectable } from '@nestjs/common';
import { CreateMesureDto } from './dto/create-mesure.dto';
import { UpdateMesureDto } from './dto/update-mesure.dto';
import { Course, Mesure, } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MesuresService {

  constructor(private prisma: PrismaService) { }

  async create(createMesureDto: CreateMesureDto) {
    const {courseId, mesureBsc, mesureMq, type,  ...mesureData } = createMesureDto; 
    const requeteSwitchIsCurrentTofalse = this.prisma.mesure.updateMany({
      where: {
        courseId: courseId
      },
      data: {
        isCurrent: false
      }
    });
    const requeteNewMesureBsc = this.prisma.mesure.create({
      data: {
        type: type, 
        isCurrent: true, 
        course: { connect: {id: courseId}}, 
        mesureBsc: {
          create: mesureBsc
        },
      }, 
      include: {
        mesureBsc: true
      }
    })

    switch ( type ) {
      case 'BSC': 
        const [resultReset, newMesure] = await this.prisma.$transaction([requeteSwitchIsCurrentTofalse, requeteNewMesureBsc]);
        return newMesure; 
      case 'MQ':
        throw new Error("Not implemented"); 
      default: 
        throw new Error("Type invalid");  

    }
  }

  async findAll() {
    const mesures: Mesure[] = await this.prisma.mesure.findMany({
      where: {
        isCurrent: true
      }, 
      include: {
        mesureBsc: true
      }
    });
    return mesures;
  }

  async findOne(id: number) {
    const mesure: Mesure | null = await this.prisma.mesure.findFirst({
      where: {
        id: id, 
      }, 
      include: {
        mesureBsc: true
      }
    })
    return mesure;
  }

  async update(id: number, updateMesureDto: UpdateMesureDto) {
    return {message: "Ne pas utiliser le UPDATE"};
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
