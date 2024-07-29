import { Injectable } from '@nestjs/common';
import { getWalletList } from 'src/utils/neucron-wallet.util';

@Injectable()
export class WalletService {
  async login(email: string, password: string): Promise<string[]> {
    try {
      const wallets = await getWalletList(email, password);
      return wallets;
    } catch (error) {
      console.log(error);
      throw new Error('bla');
    }
  }
}
