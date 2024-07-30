import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({ example: 1, description: 'Cart Item ID' })
  @IsInt()
  cartItemId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the item in the cart',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Quantity must be a positive number' })
  quantity?: number;
}
