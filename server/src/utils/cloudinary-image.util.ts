import cloudinary from '../config/cloudinary.config';
import { unlinkFile } from './temp-file-storage.util';

export async function uploadImageToCloudinary(image: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'assethub',
    });
    await unlinkFile(image);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}
