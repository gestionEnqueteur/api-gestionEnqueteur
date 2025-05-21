import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { User } from "@prisma/client";
import { UsersService } from "src/users/users.service";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: true, 
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {

    // on recupere l'utilisateur
    const user: User | null = await this.usersService.findOne(payload.sub);
    if(!user)
      throw new UnauthorizedException()
    return user;  
  }
}