import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StatusCourse } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('enq')
export class EnqController {

  constructor(private readonly prismaService: PrismaService) { }

  @UseGuards(JwtAuthGuard)
  @Get('courses')
  async findAll(@Req() req) {

    const courses = await this.prismaService.course.findMany({
      where: {
        affectationId: req.user.id,
        status: StatusCourse.AFFECTED
      }
    })

    return courses; 

  }


}
