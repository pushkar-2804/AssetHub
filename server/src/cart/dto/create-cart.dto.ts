import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsInt()
  userId: number;
  @ApiProperty({ example: 1, description: 'Asset ID' })
  @IsInt()
  assetId: number;
}
