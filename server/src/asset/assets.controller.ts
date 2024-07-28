// src/assets/assets.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utils/temp-file-storage.util';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('list')
  @ApiOperation({ summary: 'List a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  async create(
    @Body() createAssetDto: CreateAssetDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const imagePaths = files.map((file) => file.path);
    createAssetDto.images = imagePaths;
    createAssetDto.price = Number(createAssetDto.price);
    createAssetDto.userId = Number(createAssetDto.userId);
    return this.assetsService.create(createAssetDto);
  }

  // @UseGuards(JwtAuthGuard)
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

  // @UseGuards(JwtAuthGuard)
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
