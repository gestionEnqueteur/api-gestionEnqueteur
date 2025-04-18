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

  async create(createMesureDto: CreateMesureDto): Promise<MesureWithDetails> {
    const {courseId, mesureBsc, mesureMq, type,  ...mesureData } = createMesureDto; 
    const requeteSwitchIsCurrentToFalse = this.prisma.mesure.updateMany({
      where: {
        courseId: courseId
      },
      data: {
        isCurrent: false
      }
    });

    const data: Prisma.MesureCreateInput = {
      ...mesureData,
      type,
      isCurrent: true,
      course: { connect: { id: courseId } },
    };

    // On ajoute le bon type de mesure
    if (type === 'BSC' && mesureBsc) {
      data.mesureBsc = {
        create: mesureBsc,
      };
    } else if (type === 'MQ' && mesureMq) {
      data.mesureMq = {
        create: mesureMq,
      };
    }

    const requeteNewMesure = this.prisma.mesure.create({
      data,
      include: {
        mesureBsc: true,
        mesureMq: true,
      },
    });

    const [_, newMesure] = await this.prisma.$transaction([
      requeteSwitchIsCurrentToFalse,
      requeteNewMesure,
    ]);

    return newMesure;
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
