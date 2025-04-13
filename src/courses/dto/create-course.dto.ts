import { $Enums, Prisma } from "@prisma/client";

export class CreateCourseDto implements Prisma.CourseCreateInput {
    status: $Enums.StatusCourse;
    mission: string;
    trainCourse: string;
    commentaire?: string | null;
    ligne?: string | null;
    objectif?: number | null;
    service?: string | null;
    hd: string | Date;
    ha: string | Date;
    departureTimeOrigin?: string | Date | null;
    arrivalTimeTerminus?: string | Date | null;
    placeDeparture: string;
    placeArrival: string;
    mesure?: Prisma.MesureCreateNestedManyWithoutCourseInput;
    affectation?: Prisma.UserCreateNestedOneWithoutCoursesInput;
    pds?: string | null;
    vac?: string | null;
}


