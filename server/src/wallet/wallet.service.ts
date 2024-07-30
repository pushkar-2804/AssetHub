import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { getWalletList } from 'src/utils/neucron-wallet.util';

@Injectable()
export class WalletService {
  constructor(private databaseService: DatabaseService) {}
  async login(
    email: string,
    password: string,
  ): Promise<{ wallet_id: string; paymail_id: string }[]> {
    try {
      const wallets = await getWalletList(email, password);
      return wallets;
    } catch (error) {
      console.log(error);
      throw new Error('bla');
    }
  }

  async connectWallet(userId: number, walletAddress: string) {
    try {
      const wallet = await this.databaseService.wallet.upsert({
        where: { userId },
        update: { walletAddress },
        create: { userId, walletAddress },
      });
      return wallet;
    } catch (error) {
      console.log(error);
      throw new Error('bla');
    }
  }
}
