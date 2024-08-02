import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { getWalletList } from 'src/utils/neucron-wallet.util';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class WalletService {
  constructor(private databaseService: DatabaseService) {}
  async login(
    userId: number,
    email: string,
    password: string,
  ): Promise<{ wallet_id: string; paymail_id: string }[]> {
    try {
      const wallets = await getWalletList(email, password);
      // const walletCredentials = await bcrypt.hash(
      //   JSON.stringify({ userId, email, password }),
      //   10,
      // );
      const walletCredentials = CryptoJS.AES.encrypt(
        JSON.stringify({ userId, email, password }),
        'your_secret_key',
      ).toString();
      await this.databaseService.wallet.upsert({
        where: { userId },
        update: { walletCredential: walletCredentials },
        create: { userId, walletCredential: walletCredentials },
      });
      return wallets;
    } catch (error) {
      console.log(error);
      throw new Error('bla');
    }
  }

  async connectWallet(userId: number, walletAddress: string) {
    try {
      const wallet = await this.databaseService.wallet.update({
        where: { userId },
        data: { walletAddress },
      });
      return wallet;
    } catch (error) {
      console.log(error);
      throw new Error('bla');
    }
  }
}
