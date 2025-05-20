import { $Enums, Prisma } from "@prisma/client";
import { ApiProperty } from '@nestjs/swagger';
import { MesureBscDto } from './mesure-bsc.dto';
import { MesureMqDto } from './mesure-mq.dto';
import { Type } from "class-transformer";
import { IsIn, IsNumber, ValidateIf, ValidateNested } from "class-validator";
import { CreateMesureBSCDto } from "./create-mesure-bsc.dto";
import { CreateCourseDto } from "src/courses/dto/create-course.dto";

export class CreateMesureDto {
  @IsIn(["BSC"])
  @ApiProperty({ enum: ['BSC', 'MQ'] })
  type: $Enums.TypeMesure;

  @ApiProperty({ type: () => CreateCourseDto })
  course: Prisma.CourseCreateNestedOneWithoutMesureInput;

  @IsNumber()
  @ApiProperty()
  courseId: number;

  @ValidateIf(o => o.type === "BSC")
  @ValidateNested()
  @Type(() => CreateMesureBSCDto)
  @ApiProperty({ type: () => MesureBscDto, required: false, nullable: true })
  mesureBsc?: MesureBscDto;

  @ValidateIf(o => o.type === "MQ")
  @ValidateNested()
  @ApiProperty({ type: () => MesureMqDto, required: false, nullable: true })
  mesureMq?: MesureMqDto;
}
