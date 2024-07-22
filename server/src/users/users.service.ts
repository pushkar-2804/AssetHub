import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

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
    return this.database.user.update({ where: { id }, data });
  }
  async remove(id: number): Promise<User> {
    return this.database.user.delete({ where: { id } });
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.database.user.findUnique({ where: { email } });
  }
}
