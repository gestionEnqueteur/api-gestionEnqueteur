import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsBoolean()
  @ApiProperty()
  username: string;

  @IsBoolean()
  @ApiProperty()
  confirmed: boolean;

  @ApiProperty()
  blocked: boolean;

  @ApiProperty({ type: "array", items: { type: "string" }, required: false })
  roles?: string[] | Prisma.UserCreaterolesInput;

  @ApiProperty({ required: false })
  expoPushToken?: string;

  @ApiProperty({ type: () => CreateCourseDto, isArray: true, required: false })
  courses?: Prisma.CourseCreateNestedManyWithoutAffectationInput;
}