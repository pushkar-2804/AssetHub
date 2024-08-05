import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { isValidCategory } from '../utils/enum-validation.util';
import { CreateAssetDto } from './dto/create-asset.dto';
import { uploadImageToCloudinary } from '../utils/cloudinary-image.util';
import { AssetCategory } from '../enums/asset-category.enum';

@Injectable()
export class AssetService {
  constructor(private database: DatabaseService) {}

  async create(userId: number, createAssetDto: CreateAssetDto) {
    if (!isValidCategory(createAssetDto.category)) {
      throw new BadRequestException('Invalid category');
    }

    const imageUrls = await Promise.all(
      createAssetDto.images.map((image: string) =>
        uploadImageToCloudinary(image),
      ),
    );

    const assetCreateInput = {
      assetName: createAssetDto.assetName,
      description: createAssetDto.description,
      price: createAssetDto.price,
      category: createAssetDto.category,
      images: imageUrls,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    const asset = await this.database.asset.create({
      data: assetCreateInput,
    });

    return { assetId: asset.assetId, status: 'Asset created successfully' };
    console.log(asset);
  }

  async findAll(filters: {
    price?: any;
    category?: AssetCategory;
    assetName?: string;
  }) {
    if (filters?.price) {
      filters.price = +filters.price;
    }

    const whereClause: any = { ...filters };

    if (filters?.assetName) {
      whereClause.assetName = {
        contains: filters.assetName,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const assets = await this.database.asset.findMany({
      where: whereClause,
    });

    return {
      assets: assets.map((asset) => ({
        assetId: asset.assetId,
        assetName: asset.assetName,
        description: asset.description,
        price: asset.price,
        category: asset.category,
        thumbnail: asset.images[0],
      })),
    };
  }

  async findOne(assetId: number) {
    const asset = await this.database.asset.findUnique({
      where: { assetId },
    });
    if (!asset) {
      throw new NotFoundException('No asset found');
    }
    return {
      assetId: asset.assetId,
      assetName: asset.assetName,
      description: asset.description,
      price: asset.price,
      category: asset.category,
      images: asset.images,
    };
  }
  async findMyAssets(userId: number) {
    const assets = await this.database.asset.findMany({ where: { userId } });
    return assets || [];
  }
}
