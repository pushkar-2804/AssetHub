import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.database.user.create({ data });
  }
  async findOne(id: number): Promise<User> {
    return this.database.user.findUnique({ where: { id } });
  }
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);

    return this.database.user.update({ where: { id }, data });
  }
  async remove(id: number): Promise<User> {
    return this.database.user.delete({ where: { id } });
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.database.user.findUnique({ where: { email } });
  }
  // TODO: to be done
  async logout(userId: number, token: string) {
    return userId;
  }
}
