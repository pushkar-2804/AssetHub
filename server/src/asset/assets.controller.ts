// src/assets/assets.controller.ts
import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetService) {}

  @Post('list')
  @ApiOperation({ summary: 'List a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully.' })
  async create(@Body() createAssetDto: CreateAssetDto) {
    const assetCreateInput = {
      assetName: createAssetDto.assetName,
      description: createAssetDto.description,
      price: createAssetDto.price,
      category: createAssetDto.category,
      images: createAssetDto.images,
      user: {
        connect: {
          id: createAssetDto.userId,
        },
      },
    };
    return this.assetsService.create(assetCreateInput);
  }

  @Get('browse')
  @ApiOperation({ summary: 'Browse assets. Provide filters in query' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter assets by category',
    type: String,
  })
  @ApiQuery({
    name: 'price',
    required: false,
    description: 'Filter assets by price',
    type: Number,
  })
  @ApiQuery({
    name: 'assetName',
    required: false,
    description: 'Filter assets by name',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Assets retrieved successfully.' })
  async findAll(@Query() filters: any) {
    return this.assetsService.findAll(filters);
  }

  @Get('details/:id')
  @ApiOperation({ summary: 'Get asset details' })
  @ApiResponse({
    status: 200,
    description: 'Asset details retrieved successfully.',
  })
  async findOne(@Param('id') id: string) {
    return this.assetsService.findOne(+id);
  }
}
