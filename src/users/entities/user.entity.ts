import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Exclude } from 'class-transformer'
export class UserEntity {

  @Exclude()
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
  @ApiProperty({ type: "string", isArray: true, nullable: true })
  roles?: string[] | Prisma.UserCreaterolesInput | undefined;
  @Exclude()
  @ApiProperty()
  expoPushToken: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }


}