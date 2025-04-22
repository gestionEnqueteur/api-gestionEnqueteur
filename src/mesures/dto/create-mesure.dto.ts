import { $Enums, Prisma } from "@prisma/client";
import { ApiProperty } from '@nestjs/swagger';
import { MesureBscDto } from './mesure-bsc.dto';
import { MesureMqDto } from './mesure-mq.dto';



export class CreateMesureDto {
  @ApiProperty({ enum: ['BSC', 'MQ'] })
  type: $Enums.TypeMesure;

  @ApiProperty()
  courseId: number;

  @ApiProperty({ type: () => MesureBscDto, required: false, nullable: true })
  mesureBsc?: MesureBscDto;

  @ApiProperty({ type: () => MesureMqDto, required: false, nullable: true })
  mesureMq?: MesureMqDto;
}



