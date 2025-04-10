import { Module } from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { VacationsController } from './vacations.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [VacationsController],
  providers: [VacationsService, PrismaService],
  exports: [VacationsService]
})
export class VacationsModule {}
