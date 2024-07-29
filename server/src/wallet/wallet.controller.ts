import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post('get-wallet-list')
  @ApiOperation({ summary: 'Log in to fetch wallet address' })
  async login(@Body() email: string, password: string) {
    return this.walletService.login(email, password);
  }
}
