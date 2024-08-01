import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post('get-wallet-list')
  @ApiOperation({ summary: 'Log in to fetch wallet address' })
  @ApiResponse({
    status: 200,
    description: 'Wallet address fetched successfully.',
  })
  @ApiBearerAuth()
  async login(@Req() req, @Body() credentials: LoginDto) {
    const userId = +req.user.userId;
    return this.walletService.login(
      userId,
      credentials.email,
      credentials.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('connect-wallet')
  @ApiOperation({ summary: 'Upsert wallet address' })
  @ApiResponse({
    status: 200,
    description: 'Wallet address upserted successfully.',
  })
  @ApiBearerAuth()
  async upsertWalletAddress(
    @Req() req,
    @Body() updateWalletDto: CreateWalletDto,
  ) {
    const userId = +req.user.userId;
    return this.walletService.connectWallet(
      userId,
      updateWalletDto.walletAddress,
    );
  }
}
