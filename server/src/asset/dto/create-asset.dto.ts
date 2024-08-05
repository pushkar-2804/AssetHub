// src/assets/dto/create-asset.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { AssetCategory } from '../../enums/asset-category.enum';

export class CreateAssetDto {
  @ApiProperty({ example: 'Asset Name', description: 'Name of the asset' })
  @IsString()
  assetName: string;

  @ApiProperty({
    example: 'Description of the asset',
    description: 'Description of the asset',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 100, description: 'Price of the asset' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'GADGET',
    description: 'Can be GADGET || DEAL || SOFTWARE',
  })
  @IsEnum(AssetCategory)
  category: AssetCategory;

  @ApiProperty({
    example: ['image1.png', 'image2.png'],
    description: 'Images of the asset',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  images: string[];
}
