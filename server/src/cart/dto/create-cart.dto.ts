import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 1, description: 'Asset ID' })
  @IsInt()
  assetId: number;
  @ApiProperty({
    example: 1,
    description: 'Quantity of the asset in the cart',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Quantity must be a positive number' })
  quantity?: number;
}
