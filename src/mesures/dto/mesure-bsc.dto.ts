// mesure-bsc.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MesureBscDto {

  @ApiProperty({ required: false })
  composition?: string;

  @ApiProperty({ required: false })
  numMaterial?: string;

  @ApiProperty({ required: false })
  distrbutedQuestionnaire?: number;

  @ApiProperty({ required: false })
  emptyQuestionnaire?: number;

  @ApiProperty({ required: false })
  invalidQuestionnaire?: number;

  @ApiProperty({ required: false })
  validQuestionnnaire?: number;

  @ApiProperty({ required: false })
  lateDeparture?: number;

  @ApiProperty({ required: false })
  lateArrived?: number;

  @ApiProperty({ required: false })
  departureStation?: string;

  @ApiProperty({ required: false })
  arrivalStation?: string;
}

