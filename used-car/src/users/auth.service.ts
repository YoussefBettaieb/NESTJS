import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // combine the salt and the hash password
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the salt and hash together
    const result = salt + '.' + hash.toString('hex');
    // create a new user and save it
    const user = await this.usersService.create(email, result);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
