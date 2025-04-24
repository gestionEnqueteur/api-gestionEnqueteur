import { Module } from '@nestjs/common';
import { ExpoService } from './expo.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [ExpoService]
})
export class ExpoModule {}
