// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AssetModule } from './asset/asset.module';
import { CartModule } from './cart/cart.module';
import { WalletModule } from './wallet/wallet.module';

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
  providers: [],
})
export class AppModule {}
