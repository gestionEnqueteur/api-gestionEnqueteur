import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ UsersModule, PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        //signOptions: { expiresIn: "" }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy], 
  exports: [AuthService], 
})
export class AuthModule { }
