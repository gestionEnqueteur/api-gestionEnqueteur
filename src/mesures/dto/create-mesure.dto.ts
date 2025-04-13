import { $Enums, Prisma } from "@prisma/client";

export class CreateMesureDto 
{
    type: $Enums.TypeMesure;
    course: Prisma.CourseCreateNestedOneWithoutMesureInput;
    courseId: number; 
    mesureBsc?: Prisma.MesureBscCreateNestedOneWithoutMesureInput;
    mesureMq?: Prisma.MesureMQCreateNestedOneWithoutMesureInput;
}

