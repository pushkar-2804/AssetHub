import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DatabaseService } from '../database/database.service';
import { WalletController } from './wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [WalletService, DatabaseService],
})
export class WalletModule {}
