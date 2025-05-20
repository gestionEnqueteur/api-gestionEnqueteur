import { PartialType } from '@nestjs/swagger';
import { CreateMesureDto } from './create-mesure.dto';

export class UpdateMesureDto extends PartialType(CreateMesureDto) {}
