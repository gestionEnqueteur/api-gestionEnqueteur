import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, type: CreateCourseDto })
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      return await this.coursesService.create(createCourseDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, type: [CreateCourseDto] })
  async findAll() {
    return await this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiResponse({ status: 200, type: CreateCourseDto })
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(+id);
    if (!course) {
      throw new NotFoundException();
    }
    return course;
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update a course by ID' })
  @ApiResponse({ status: 200, type: UpdateCourseDto })
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      return await this.coursesService.update(+id, updateCourseDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course by ID' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    try {
      return await this.coursesService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error); 
    }
  }
}
