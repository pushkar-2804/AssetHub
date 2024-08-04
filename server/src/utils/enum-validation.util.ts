import { AssetCategory } from '../enums/asset-category.enum';

export function isValidCategory(category: string): category is AssetCategory {
  return Object.values(AssetCategory).includes(category as AssetCategory);
}
