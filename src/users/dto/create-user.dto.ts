import { Prisma } from "@prisma/client";
import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
    @IsNotEmpty()
    password: string;
    @IsEmail()
    email: string;
    username: string;
    @IsBoolean()
    confirmed: boolean;
    @IsBoolean()
    blocked: boolean;
    roles?: string[] | Prisma.UserCreaterolesInput;
    expoPushToken?: string;
    courses?: Prisma.CourseCreateNestedManyWithoutAffectationInput;
    
}