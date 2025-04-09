import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { Course } from '@prisma/client';

@Injectable()
export class CoursesService {

  constructor(private prisma: PrismaService ) {}

  async create(createCourseDto: CreateCourseDto) {
    const newCourse: Course = await this.prisma.course.create({
      data: createCourseDto
    })
    return newCourse; 
  }

  async findAll() {
    const courses: Course[] = await this.prisma.course.findMany(); 
    return courses;
  }

  async findOne(id: number) {
    const course: Course | null = await this.prisma.course.findFirst({
      where: {
        id: id
      }
    })
    return course
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const updateCourse: Course = await this.prisma.course.update({
      where: {
        id: id
      }, 
      data: updateCourseDto
    })
    return updateCourse
  }

  async remove(id: number) {
    const deleteCourse: Course = await this.prisma.course.delete({
      where: {
        id: id
      }
    })
    return deleteCourse;
  }
}
