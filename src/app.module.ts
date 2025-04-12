import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { MesuresModule } from './mesures/mesures.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CoursesModule, MesuresModule, UsersModule, AuthModule, ConfigModule.forRoot({
    isGlobal: true
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
