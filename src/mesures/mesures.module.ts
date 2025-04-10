import { Module } from '@nestjs/common';
import { MesuresService } from './mesures.service';
import { MesuresController } from './mesures.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MesuresController],
  providers: [MesuresService, PrismaService],
  exports: [MesuresService]
})
export class MesuresModule {}
