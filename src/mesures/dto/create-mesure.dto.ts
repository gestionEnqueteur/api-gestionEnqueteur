import { $Enums, Prisma } from "@prisma/client";

export class CreateMesureDto implements Prisma.MesureCreateInput
{
    type: $Enums.TypeMesure;
    course?: Prisma.CourseCreateNestedManyWithoutMesureInput | undefined;
    mesureBsc?: Prisma.MesureBscCreateNestedOneWithoutMesureInput | undefined;
    mesureMq?: Prisma.MesureMQCreateNestedOneWithoutMesureInput | undefined;
}
