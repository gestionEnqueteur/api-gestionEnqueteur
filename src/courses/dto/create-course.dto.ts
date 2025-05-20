import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { CreateMesureDto } from 'src/mesures/dto/create-mesure.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto implements Prisma.CourseCreateInput {
  @ApiProperty({ enum: ['DRAFT', 'AFFECTED', 'CANCELED', 'TERMINED'] })
  status: $Enums.StatusCourse;

  @IsIn(["BSC", "MQ", "IT", "HLP"])
  @ApiProperty()
  mission: string;

  @IsString()
  @ApiProperty()
  trainCourse: string;

  @IsOptional()
  @ApiProperty({ type: "string", required: false, nullable: true })
  commentaire?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: "string", required: false, nullable: true })
  ligne?: string | null;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: "number", required: false, nullable: true })
  objectif?: number | null;

  @ApiProperty({ type: "string", required: false, nullable: true })
  service?: string | null;

  @IsDate()
  @ApiProperty({ type: "string" })
  hd: string | Date;

  @IsDate()
  @ApiProperty({ type: "string" })
  ha: string | Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({ type: "string", required: false, nullable: true })
  departureTimeOrigin?: string | Date | null;

  @IsOptional()
  @IsDate()
  @ApiProperty({ type: "string", required: false, nullable: true })
  arrivalTimeTerminus?: string | Date | null;

  @IsString()
  @ApiProperty()
  placeDeparture: string;

  @IsString()
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