import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { MesuresModule } from './mesures/mesures.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ExpoModule } from './expo/expo.module';
import { EnqController } from './enq/enq.controller';
import { EnqModule } from './enq/enq.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [CoursesModule, MesuresModule, UsersModule, AuthModule, EnqModule, ConfigModule.forRoot({
    isGlobal: true
  }), ExpoModule, EnqModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
