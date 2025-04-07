import { Module } from '@nestjs/common';
import { MesuresService } from './mesures.service';
import { MesuresController } from './mesures.controller';

@Module({
  controllers: [MesuresController],
  providers: [MesuresService],
})
export class MesuresModule {}
