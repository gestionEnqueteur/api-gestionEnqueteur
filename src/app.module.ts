import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { MesuresModule } from './mesures/mesures.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ExpoModule } from './expo/expo/expo.module';
import { ExpoModule } from './expo/expo.module';

@Module({
  imports: [CoursesModule, MesuresModule, UsersModule, AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), ExpoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
