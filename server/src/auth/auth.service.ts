// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { sub: user.id };
      return {
        userId: user.id,
        token: this.jwtService.sign(payload),
      };
    }
    throw new Error('Invalid credentials');
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ userId: number; token: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const payload = { sub: user.id };
    return {
      userId: user.id,
      token: this.jwtService.sign(payload),
    };
  }
}
