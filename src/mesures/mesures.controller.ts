import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { MesuresService } from './mesures.service';
import { CreateMesureDto } from './dto/create-mesure.dto';
import { UpdateMesureDto } from './dto/update-mesure.dto';
import { Mesure } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('mesures')
@Controller('mesures')
export class MesuresController {
  constructor(private readonly mesuresService: MesuresService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new mesure' })
  @ApiResponse({ status: 201, type: CreateMesureDto })
  async create(@Body() createMesureDto: CreateMesureDto) {
    try {
      return await this.mesuresService.create(createMesureDto);
    }
    catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all mesures' })
  @ApiResponse({ status: 200, type: [CreateMesureDto] })
  findAll() {
    return this.mesuresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mesure by ID' })
  @ApiResponse({ status: 200, type: CreateMesureDto })
  async findOne(@Param('id') id: string) {
    const mesure: Mesure | null = await this.mesuresService.findOne(+id);
    if (!mesure)
      throw new NotFoundException();

    return mesure
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mesure by ID' })
  @ApiResponse({ status: 200, type: UpdateMesureDto })
  async update(@Param('id') id: string, @Body() updateMesureDto: UpdateMesureDto) {
    try {
      return await this.mesuresService.update(+id, updateMesureDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mesure by ID' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    try {
      return await this.mesuresService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
