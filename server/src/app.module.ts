// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AssetService } from './asset/asset.service';
import { AssetModule } from './asset/asset.module';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AssetModule,
    AuthModule,
    CartModule,
    DatabaseModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
