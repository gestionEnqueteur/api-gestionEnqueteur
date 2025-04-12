import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { AuthUser } from './interfaces/auth-user.interface';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) { }
	// login from scratch
	@HttpCode(HttpStatus.OK)
	@Post('loginFromScratch')
	signIn(@Body() signInDto: Record<string, any>) {
		return this.authService.signIn(signInDto.username, signInDto.password); 
	}

	// guard qui gere le login, intercepté par la guard de passport
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: AuthenticatedRequest ) { 
		console.log(req.user); 
		return this.authService.login(req.user); 
	}

	// login with send expoPushToken to app mobile
	@UseGuards(LocalAuthGuard)
  @Post('loginApp')
	async loginApp(@Req() req, @Body() body) {
		return this.authService.loginApp(req.user, body.expoPushToken)
	}

	// route protégé par le guard
	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() req) {
		console.log(req.user);

		return plainToInstance(UserEntity, req.user); 
	}
}

interface AuthenticatedRequest extends Request{
	user: AuthUser
}
