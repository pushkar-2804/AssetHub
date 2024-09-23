// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AssetModule } from './asset/asset.module';
import { CartModule } from './cart/cart.module';
import { WalletModule } from './wallet/wallet.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { OrderController } from './orders/orders.controller';
import { CartService } from './cart/cart.service';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AssetModule,
    AuthModule,
    CartModule,
    DatabaseModule,
    UsersModule,
    WalletModule,
  ],
  controllers: [AppController, OrderController], // Add OrderController here
  providers: [AppService, CartService, DatabaseService], // Add services used in OrderController
})
export class AppModule {}
