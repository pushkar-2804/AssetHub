import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { isValidCategory } from 'src/utils/enum-validation.util';

@Injectable()
export class AssetService {
  constructor(private database: DatabaseService) {}

  async create(data: Prisma.AssetCreateInput) {
    if (!isValidCategory(data.category)) {
      throw new BadRequestException('Invalid category');
    }
    const asset = await this.database.asset.create({
      data,
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
