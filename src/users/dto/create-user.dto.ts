import { Prisma } from "@prisma/client";

export class CreateUserDto implements Prisma.UserCreateInput {
    password: string;
    email: string;
    username: string;
    confirmed: boolean;
    blocked: boolean;
    roles?: string[] | Prisma.UserCreaterolesInput;
    expoPushToken?: string;
    courses?: Prisma.CourseCreateNestedManyWithoutAffectationInput;
    
}