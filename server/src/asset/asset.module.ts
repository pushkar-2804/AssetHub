// src/assets/asset.module.ts
import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetsController } from './assets.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [AssetsController],
  providers: [AssetService, DatabaseService],
})
export class AssetModule {}
