import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }
    // login simple from scratch
    async signIn(username: string, pass: string) {
        const user = await this.usersService.findOneByUsername(username);
        if (user?.password !== pass)
            throw new UnauthorizedException();

        const { password, expoPushToken, ...result } = user;

        const payload = { sub: user.id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: result
        }
    }
    // utilisé par la strategy local.strategy pour le login 
    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findOneByUsername(username);
        if (user && user.password === pass) {
            const { password, expoPushToken, ...result } = user;
            return result;
        }
        return null;
    }

    // login version Passpost, le guard va renseigné user directement 
    async login(user: AuthUser) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async loginApp(user: AuthUser, expoPushToken: string) {
        console.log(`le token est : ${expoPushToken}`)
        if (!expoPushToken)
            throw new BadRequestException({}, "Token ExpoPush missing"); 

        //TODO: plus tard, ajouter une vérification de expoPushToken

        this.usersService.update(+user.id, { expoPushToken: expoPushToken})
        return this.login(user);
    }


}
