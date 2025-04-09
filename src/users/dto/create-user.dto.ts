import { Prisma } from "@prisma/client";

export class CreateUserDto implements Prisma.UserCreateInput {
    email: string;
    username: string;
    confirmed: boolean;
    blocked: boolean;
    roles?: string[] | Prisma.UserCreaterolesInput | undefined;
    expoPushToken: string;
    vacation?: Prisma.VacationCreateNestedManyWithoutUserInput | undefined;
}
