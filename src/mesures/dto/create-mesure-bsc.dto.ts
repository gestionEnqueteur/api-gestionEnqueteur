import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsPositive, IsString, ValidateIf, ValidateNested } from "class-validator";

export class CreateMesureBSCDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    mesureId: number;

    @IsIn(["US", "UM2", "UM3"])
    @ApiProperty({ type: "string", required: false, nullable: true })
    composition: string | null;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: "string", required: false, nullable: true })
    numMaterial: string | null;

    @IsOptional()
    @IsPositive()
    @ApiProperty({ type: "number", required: false, nullable: true })
    distrbutedQuestionnaire: number | null;

    @IsOptional()
    @IsPositive()
    @ApiProperty({ type: "number", required: false, nullable: true })
    emptyQuestionnaire: number | null;

    @IsOptional()
    @IsPositive()
    @ApiProperty({ type: "number", required: false, nullable: true })
    invalidQuestionnaire: number | null;

    @IsOptional()
    @IsPositive()
    @ApiProperty({ type: "number", required: false, nullable: true })
    validQuestionnnaire: number | null;

    @IsOptional()
    @IsPositive()
    @ApiProperty({ type: "number", required: false, nullable: true })
    lateDeparture: number | null;

    @IsOptional()
    @IsPositive()
    @ApiProperty({ type: "number", required: false, nullable: true })
    lateArrived: number | null;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: "string", required: false, nullable: true })
    departureStation: string | null;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: "string", required: false, nullable: true })
    arrivalStation: string | null;
}