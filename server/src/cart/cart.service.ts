import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CartService {
  constructor(private database: DatabaseService) {}

  async addToCart(userId: number, assetId: number, quantity: number) {
    if (!userId || !assetId) {
      throw new BadRequestException('User ID and Asset ID are required.');
    }
    // if cart exists
    let cart = await this.database.cart.findFirst({
      where: { userId },
      include: { cartItems: { include: { asset: true } } },
    });
    // if not then create one
    if (!cart) {
      cart = await this.database.cart.create({
        data: { userId, totalPrice: 0 },
        include: { cartItems: { include: { asset: true } } },
      });
    }
    if (cart) {
      const alreadyExistInCart = cart.cartItems.filter(
        (item) => item.asset.assetId == assetId,
      );
      if (alreadyExistInCart) {
        throw new BadRequestException('Asset already present');
      }
    }

    // find asset
    const asset = await this.database.asset.findUnique({
      where: { assetId },
    });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    // create a cartItem :)
    await this.database.cartItem.create({
      data: {
        cartId: cart.id,
        assetId: asset.assetId,
        quantity,
      },
    });
    // update the cart
    await this.database.cart.update({
      where: { id: cart.id },
      data: { totalPrice: cart.totalPrice + asset.price * quantity },
    });

    return { cartId: cart.id, status: 'Asset added to cart' };
  }

  async viewCart(userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    const cart = await this.database.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { asset: true } } },
    });

    if (!cart) {
      return { cartItems: [], totalPrice: 0 };
    }

    const cartItems = cart.cartItems.map((item) => ({
      cartItemId: item.id,
      assetId: item.asset.assetId,
      assetName: item.asset.assetName,
      price: item.asset.price,
      quantity: item.quantity,
    }));

    return { totalPrice: cart.totalPrice, cartItems };
  }

  async checkout(userId: number, cartId: number) {
    if (!userId || !cartId) {
      throw new BadRequestException('User ID and Cart ID are required.');
    }
    const cart = await this.database.cart.findUnique({
      where: { id: cartId, userId },
      include: { cartItems: { include: { asset: true } } },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found or already checked out');
    }
    // TODO: to be done after wallet integration.
    // Create txn here
    const transactionId = Math.floor(Math.random() * 1000000); // random for now
    const transaction = await this.database.purchases.create({
      data: {
        userId,
        transactionId,
        date: new Date(),
      },
    });
    // Delete all cart items first
    // Delete all cart items first
    await this.database.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Delete the cart
    await this.database.cart.delete({
      where: { id: cart.id },
    });
    return {
      transactionId: transaction.transactionId,
      status: 'Checkout successful',
    };
  }
}
