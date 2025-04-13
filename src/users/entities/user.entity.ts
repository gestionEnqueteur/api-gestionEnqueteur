import { Prisma } from "@prisma/client";
import { Exclude } from 'class-transformer'
export class UserEntity {

  @Exclude()
  password: string;
  email: string;
  username: string;
  confirmed: boolean;
  blocked: boolean;
  roles?: string[] | Prisma.UserCreaterolesInput | undefined;
  @Exclude()
  expoPushToken: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }


}