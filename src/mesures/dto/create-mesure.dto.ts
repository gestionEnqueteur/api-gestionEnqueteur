import { $Enums, Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsPositive, IsString, ValidateIf, ValidateNested } from "class-validator";

export class CreateMesureBSCDto {
    id: number;
    mesureId: number;
    @IsIn(["US", "UM2", "UM3"])
    composition: string | null;
    @IsOptional()
    @IsString()
    numMaterial: string | null;
    @IsOptional()
    @IsPositive()
    distrbutedQuestionnaire: number | null;
    @IsOptional()
    @IsPositive()
    emptyQuestionnaire: number | null;
    @IsOptional()
    @IsPositive()
    invalidQuestionnaire: number | null;
    @IsOptional()
    @IsPositive()
    validQuestionnnaire: number | null;
    @IsOptional()
    @IsPositive()
    lateDeparture: number | null;
    @IsOptional()
    @IsPositive()
    lateArrived: number | null;
    @IsOptional()
    @IsString()
    departureStation: string | null;
    @IsOptional()
    @IsString()
    arrivalStation: string | null;

}
export class CreateMesureDto {
    @IsIn(["BSC"])
    type: $Enums.TypeMesure;
    course: Prisma.CourseCreateNestedOneWithoutMesureInput;
    @IsNumber()
    courseId: number;
    @ValidateIf(o => o.type === "BSC")
    @ValidateNested()
    @Type(() => CreateMesureBSCDto)
    mesureBsc?: CreateMesureBSCDto;
    @ValidateIf(o => o.type === "MQ")
    @ValidateNested()
    mesureMq?: Prisma.MesureMQCreateNestedOneWithoutMesureInput;
}


