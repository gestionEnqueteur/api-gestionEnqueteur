import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { CreateMesureDto } from 'src/mesures/dto/create-mesure.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateCourseDto implements Prisma.CourseCreateInput {
  @ApiProperty({ enum: ['DRAFT', 'AFFECTED', 'CANCELED', 'TERMINED'] })
  status: $Enums.StatusCourse;

  @ApiProperty()
  mission: string;

  @ApiProperty()
  trainCourse: string;

  @ApiProperty({ type: "string", required: false, nullable: true })
  commentaire?: string | null;

  @ApiProperty({ type: "string", required: false, nullable: true })
  ligne?: string | null;

  @ApiProperty({ type: "number", required: false, nullable: true })
  objectif?: number | null;

  @ApiProperty({ type: "string", required: false, nullable: true })
  service?: string | null;

  @ApiProperty({ type: "string" })
  hd: string | Date;

  @ApiProperty({ type: "string" })
  ha: string | Date;

  @ApiProperty({ type: "string", required: false, nullable: true })
  departureTimeOrigin?: string | Date | null;

  @ApiProperty({ type: "string", required: false, nullable: true })
  arrivalTimeTerminus?: string | Date | null;

  @ApiProperty()
  placeDeparture: string;

  @ApiProperty()
  placeArrival: string;

  @ApiProperty({ type: () => CreateMesureDto, required: false, nullable: true })
  mesure?: Prisma.MesureCreateNestedManyWithoutCourseInput;

  @ApiProperty({ type: () => CreateUserDto, required: false, nullable: true })
  affectation?: Prisma.UserCreateNestedOneWithoutCoursesInput;

  @ApiProperty({ type: "string", required: false, nullable: true })
  pds?: string | null;

  @ApiProperty({ type: "string", required: false, nullable: true })
  vac?: string | null;
}

