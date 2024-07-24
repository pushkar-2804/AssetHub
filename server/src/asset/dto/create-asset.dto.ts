// src/assets/dto/create-asset.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 'Asset Name', description: 'Name of the asset' })
  @IsString()
  assetName: string;

  @ApiProperty({
    example: 'Description of the asset',
    description: 'Description of the asset',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 100.5, description: 'Price of the asset' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'Category', description: 'Category of the asset' })
  @IsString()
  category: string;

  @ApiProperty({
    example: ['image1.png', 'image2.png'],
    description: 'Images of the asset',
  })
  @IsArray()
  @ArrayNotEmpty()
  images: string[];
}
