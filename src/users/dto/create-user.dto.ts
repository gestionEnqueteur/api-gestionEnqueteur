import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';

export class CreateUserDto implements Prisma.UserCreateInput {
  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

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
