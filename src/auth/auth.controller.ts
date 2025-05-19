import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { AuthUser } from './interfaces/auth-user.interface';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) { }
	// login from scratch
	@HttpCode(HttpStatus.OK)
	@Post('loginFromScratch')
	@ApiBody({ schema: { type: "object", additionalProperties: true }})
	signIn(@Body() signInDto: Record<string, any>) {
		return this.authService.signIn(signInDto.username, signInDto.password); 
	}

	// guard qui gere le login, intercepté par la guard de passport
	@UseGuards(LocalAuthGuard)
	@Post('login')
	@ApiBody({ schema: { type: "object", required: ["user"], properties: { "user": { type: "object", properties: { "username": { type: "string" }, "id": { type: "string" }}, required: [ "username", "id"] }}}})
	async login(@Req() req: AuthenticatedRequest ) { 
		console.log(req.user); 
		return this.authService.login(req.user); 
	}

	// login with send expoPushToken to app mobile
	@UseGuards(LocalAuthGuard)
  @Post('loginApp')
	@ApiBody({ schema: { type: "object", required: ["user"], properties: { "user": { type: "object", properties: { "username": { type: "string" }, "id": { type: "string" }, "expoPushToken": { type: "string" }}, required: [ "username", "id"] }}}})
	async loginApp(@Req() req, @Body() body) {
		return this.authService.loginApp(req.user, body.expoPushToken)
	}

	// route protégé par le guard
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	@Get('profile')
	@ApiBody({ schema: { type: "object", required: ["user"], properties: { "user": { type: "object", properties: { "username": { type: "string" }, "id": { type: "string" }}, required: [ "username", "id"] }}}})
	getProfile(@Req() req) {
		console.log(req.user);

		return plainToInstance(UserEntity, req.user); 
	}
}

interface AuthenticatedRequest extends Request{
	user: AuthUser
}
