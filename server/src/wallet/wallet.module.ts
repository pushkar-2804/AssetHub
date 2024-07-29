import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [],
  providers: [WalletService, DatabaseService],
})
export class WalletModule {}
