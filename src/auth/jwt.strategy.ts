import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { User } from "@prisma/client";
import { UsersService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: true, 
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: JwtPayload) {

    // on recupere l'utilisateur
    const user: User | null = await this.usersService.findOne(payload.sub);
    if(!user)
      throw new NotFoundException();  
    return user;  
  }
}