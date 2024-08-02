import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ example: '0x123456789abcdef', description: 'Wallet Address' })
  @IsString()
  walletAddress: string;
}
