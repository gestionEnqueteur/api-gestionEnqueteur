import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EnqController } from './enq.controller';

@Module({
  controllers: [EnqController], 
  providers: [PrismaService]
})
export class EnqModule {}
