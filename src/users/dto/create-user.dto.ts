import { Prisma } from "@prisma/client";

export class CreateUserDto implements Prisma.UserCreateInput {
    password: string;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    email: string;
    username: string;
    confirmed: boolean;
    blocked: boolean;
    roles?: string[] | Prisma.UserCreaterolesInput | undefined;
    expoPushToken: string;
    courses?: Prisma.CourseCreateNestedManyWithoutAffectationInput | undefined;
    
}