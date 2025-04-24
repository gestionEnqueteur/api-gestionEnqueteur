import { $Enums, Prisma } from "@prisma/client";
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto implements Prisma.CourseCreateInput {
    status: $Enums.StatusCourse;
    @IsIn(["BSC", "MQ", "IT", "HLP"])
    mission: string;
    @IsString()
    trainCourse: string;
    @IsOptional()
    commentaire?: string | null;
    @IsOptional()
    @IsString()
    ligne?: string | null;
    @IsOptional()
    @IsNumber()
    objectif?: number | null;
    service?: string | null;
    @IsDate()
    hd: string | Date;
    @IsDate()
    ha: string | Date;
    @IsOptional()
    @IsDate()
    departureTimeOrigin?: string | Date | null;
    @IsOptional()
    @IsDate()
    arrivalTimeTerminus?: string | Date | null;
    @IsString()
    placeDeparture: string;
    @IsString()
    placeArrival: string;
    mesure?: Prisma.MesureCreateNestedManyWithoutCourseInput;
    affectation?: Prisma.UserCreateNestedOneWithoutCoursesInput;
    pds?: string | null;
    vac?: string | null;
}


