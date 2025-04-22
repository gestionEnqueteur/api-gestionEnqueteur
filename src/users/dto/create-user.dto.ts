import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

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

  @ApiProperty({ required: false })
  roles?: string[] | Prisma.UserCreaterolesInput;

  @ApiProperty({ required: false })
  expoPushToken?: string;

  @ApiProperty({ required: false })
  courses?: Prisma.CourseCreateNestedManyWithoutAffectationInput;
}
