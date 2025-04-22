import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';

export class CreateCourseDto implements Prisma.CourseCreateInput {
  @ApiProperty({ enum: ['DRAFT', 'AFFECTED', 'CANCELED', 'TERMINED'] })
  status: $Enums.StatusCourse;

  @ApiProperty()
  mission: string;

  @ApiProperty()
  trainCourse: string;

  @ApiProperty({ required: false, nullable: true })
  commentaire?: string | null;

  @ApiProperty({ required: false, nullable: true })
  ligne?: string | null;

  @ApiProperty({ required: false, nullable: true })
  objectif?: number | null;

  @ApiProperty({ required: false, nullable: true })
  service?: string | null;

  @ApiProperty()
  hd: string | Date;

  @ApiProperty()
  ha: string | Date;

  @ApiProperty({ required: false, nullable: true })
  departureTimeOrigin?: string | Date | null;

  @ApiProperty({ required: false, nullable: true })
  arrivalTimeTerminus?: string | Date | null;

  @ApiProperty()
  placeDeparture: string;

  @ApiProperty()
  placeArrival: string;

  @ApiProperty({ required: false, nullable: true })
  mesure?: Prisma.MesureCreateNestedManyWithoutCourseInput;

  @ApiProperty({ required: false, nullable: true })
  affectation?: Prisma.UserCreateNestedOneWithoutCoursesInput;

  @ApiProperty({ required: false, nullable: true })
  pds?: string | null;

  @ApiProperty({ required: false, nullable: true })
  vac?: string | null;
}

