import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { MesuresService } from './mesures.service';
import { CreateMesureDto } from './dto/create-mesure.dto';
import { UpdateMesureDto } from './dto/update-mesure.dto';
import { Mesure } from '@prisma/client';

@Controller('mesures')
export class MesuresController {
  constructor(private readonly mesuresService: MesuresService) { }

  @Post()
  async create(@Body() createMesureDto: CreateMesureDto) {
    try {
      return await this.mesuresService.create(createMesureDto);
    }
    catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  findAll() {
    return this.mesuresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mesure: Mesure | null = await this.mesuresService.findOne(+id);
    if (!mesure)
      throw new NotFoundException();

    return mesure
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMesureDto: UpdateMesureDto) {
    try {
      return await this.mesuresService.update(+id, updateMesureDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.mesuresService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
