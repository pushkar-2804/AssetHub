import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { DatabaseService } from 'src/database/database.service';
import { CartController } from './cart.controller';

@Module({
  controllers: [CartController],
  providers: [CartService, DatabaseService],
})
export class CartModule {}
