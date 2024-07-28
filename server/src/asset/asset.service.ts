import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { isValidCategory } from 'src/utils/enum-validation.util';
import { CreateAssetDto } from './dto/create-asset.dto';
import { uploadImageToCloudinary } from 'src/utils/cloudinary-image.util';

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
  }

  async findAll(filters: any) {
    const assets = await this.database.asset.findMany({
      where: filters,
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
}
