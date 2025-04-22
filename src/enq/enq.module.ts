import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EnqController } from './enq.controller';
import { MesuresService } from 'src/mesures/mesures.service';
import { MesuresModule } from 'src/mesures/mesures.module';

@Module({
  controllers: [EnqController],
  providers: [MesuresService, PrismaService]
})
export class EnqModule {}
