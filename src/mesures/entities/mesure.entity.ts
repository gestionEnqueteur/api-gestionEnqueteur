import { $Enums, Mesure, Prisma, PrismaClient } from "@prisma/client";


// Mesure Commun 
export class MesureEntity implements Mesure {
  id: number;
  courseId: number;
  createAt: Date;
  updatedAt: Date;
  type: $Enums.TypeMesure;
  isCurrent: boolean;
  course: Prisma.CourseCreateNestedOneWithoutMesureInput;
  mesureBsc?: Prisma.MesureBscCreateNestedOneWithoutMesureInput | undefined;
  mesureMq?: Prisma.MesureMQCreateNestedOneWithoutMesureInput | undefined;

}

