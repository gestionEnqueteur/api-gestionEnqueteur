import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { StatusCourse, User } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMesureDto } from 'src/mesures/dto/create-mesure.dto';
import { MesuresService } from 'src/mesures/mesures.service';
import { PrismaService } from 'src/prisma.service';

@Controller('enq')
export class EnqController {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly mesureService: MesuresService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('courses')
  async findAll(@Req() req: Request & { user: User}) {

    const courses = await this.prismaService.course.findMany({
      where: {
        affectationId: req.user.id,
        status: StatusCourse.AFFECTED
      }
    })
    return courses;
  }

  @UseGuards(JwtAuthGuard)
  @Post('mesures')
  async createMesure(@Body() createMesureDTO: CreateMesureDto) {
    return await this.mesureService.create(createMesureDTO)
  }
}
