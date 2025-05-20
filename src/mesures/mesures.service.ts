import { Injectable } from '@nestjs/common';
import { CreateMesureDto } from './dto/create-mesure.dto';
import { UpdateMesureDto } from './dto/update-mesure.dto';
import { Prisma, Mesure } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

type MesureWithDetails = Prisma.MesureGetPayload<{
  include: { mesureBsc: true; mesureMq: true };
}>;

@Injectable()
export class MesuresService {

  constructor(private prisma: PrismaService) { }

  async create(createMesureDto: CreateMesureDto): Promise<Mesure> {
    const {courseId, mesureBsc, mesureMq, type,  ...mesureData } = createMesureDto; 
    const requeteSwitchIsCurrentToFalse = this.prisma.mesure.updateMany({
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
        const [resultReset, newMesure] = await this.prisma.$transaction([requeteSwitchIsCurrentToFalse, requeteNewMesureBsc]);
        return newMesure; 
      case 'MQ':
        throw new Error("Not implemented"); 
      default: 
        throw new Error("Type invalid");  

    }
  }

  async findAll(): Promise<MesureWithDetails[]> {
    return this.prisma.mesure.findMany({
      where: {
        isCurrent: true
      }, 
      include: {
        mesureBsc: true,
        mesureMq: true,
      }
    });
  }

  async findOne(id: number):Promise<MesureWithDetails | null> {
    return this.prisma.mesure.findFirst({
      where: {
        id: id, 
      }, 
      include: {
        mesureBsc: true,
        mesureMq: true,
      }
    })
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
