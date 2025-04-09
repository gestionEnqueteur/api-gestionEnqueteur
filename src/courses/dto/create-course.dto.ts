import { Prisma } from "@prisma/client";

export class CreateCourseDto implements Prisma.CourseCreateInput {
    mission: string;
    trainCourse: string;
    commentaire?: string | null | undefined;
    ligne?: string | null | undefined;
    objectif?: number | null | undefined;
    service?: string | null | undefined;
    hd: string | Date;
    ha: string | Date;
    departureTimeOrigin?: string | Date | null | undefined;
    arrivalTimeTerminus?: string | Date | null | undefined;
    placeDeparture: string;
    placeArrival: string;
    vacation: Prisma.VacationCreateNestedOneWithoutCoursesInput;
    mesure?: Prisma.MesureCreateNestedOneWithoutCourseInput | undefined;
}


