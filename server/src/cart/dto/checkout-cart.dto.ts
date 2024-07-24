import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CheckoutCartDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1, description: 'Cart ID' })
  @IsInt()
  cartId: number;
}
