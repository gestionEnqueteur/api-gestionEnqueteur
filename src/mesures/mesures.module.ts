import { Module } from '@nestjs/common';
import { MesuresService } from './mesures.service';
import { MesuresController } from './mesures.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MesuresController],
  providers: [MesuresService, PrismaService],
})
export class MesuresModule {}
