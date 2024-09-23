import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { handlePayment } from '../utils/neucron-wallet.util';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CartService {
  constructor(private database: DatabaseService) {}

  async addToCart(userId: number, assetId: number, quantity: number) {
    try {
      if (!assetId) {
        throw new BadRequestException('User ID and Asset ID are required.');
      }

      // if cart exists
      console.log('hello', assetId);
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

        if (alreadyExistInCart.length) {
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
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(userId: number, updateCartDto: UpdateCartDto) {
    const { cartItemId, quantity } = updateCartDto;

    if (!cartItemId) {
      throw new BadRequestException(' Cart ID are required.');
    }

    if (quantity < 0) {
      throw new BadRequestException("quantity can't be less than 0");
    }

    const cart = await this.database.cart.findFirst({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const cartItem = await this.database.cartItem.findFirst({
      where: { id: cartItemId },
    });
    if (!cartItem) {
      throw new NotFoundException('Item not found in cart.');
    }

    if (quantity === 0) {
      await this.database.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await this.database.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    const updatedTotalPrice = await this.calculateTotalPrice(cart.id);
    await this.database.cart.update({
      where: { id: cart.id },
      data: { totalPrice: updatedTotalPrice },
    });

    return { cartId: cart.id, status: 'Cart updated successfully' };
  }

  private async calculateTotalPrice(cartId: number): Promise<number> {
    const cartItems = await this.database.cartItem.findMany({
      where: { cartId },
      include: { asset: true },
    });
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.asset.price * item.quantity;
    }, 0);
    return totalPrice;
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

  async checkout(userId: number) {
    try {
      const cart = await this.database.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              asset: { include: { user: { include: { wallet: true } } } },
            },
          },
        },
      });
      if (!cart) {
        throw new NotFoundException('Cart not found or already checked out');
      }
      const cartId: number = cart.id;
      const user = await this.database.wallet.findUnique({ where: { userId } });
      const creds = user.walletCredential;
      const decrypted = CryptoJS.AES.decrypt(creds, 'your_secret_key');
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      const credentials = JSON.parse(decryptedString);

      const email = credentials.email;
      const password = credentials.password;
      // console.log(email, password);
      const transactionId = Math.floor(Math.random() * 1000000);
      const transactions = [];

      for (const cartItem of cart.cartItems) {
        const asset = cartItem.asset;
        const amount = asset.price * cartItem.quantity;
        const seller = asset.user;
        // Handle payment for each seller
        const txId = await handlePayment(
          email,
          password,
          seller.wallet.walletAddress,
          amount,
          cartId,
        );
        //         const txId = Math.floor(Math.random() * 1000000);
        console.log(txId);

        // Add the order to the Orders table
      await this.database.order.create({
        data: {
          userId: userId,
          assetId: asset.assetId,
          quantity: cartItem.quantity,
          totalPrice: asset.price * cartItem.quantity,
          orderDate: new Date(),
          bitcoinTransactionId: txId,  // Storing Bitcoin transaction ID
        },
      });

        transactions.push({
          userId,
          transactionId,
          assetId: asset.assetId,
          sellerId: seller.id,
          txId,
          date: new Date(),
        });
      }

      console.log(transactions)

      // Save transactions to database
      await this.database.purchases.createMany({ data: transactions });
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
        transactionId: transactionId,
        status: 'Checkout successful',
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getMyOrders(userId: number) {
    try {
      const orders = await this.database.order.findMany({
        where: { userId: Number(userId) },
        include: { asset: true }, // Include the asset details
      });
  
      if (!orders || orders.length === 0) {
        return { message: 'No orders found.' };
      }
  
      const formattedOrders = orders.map((order) => ({
        orderId: order.id,
        assetName: order.asset.assetName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        orderDate: order.orderDate,
        bitcoinTransactionId: order.bitcoinTransactionId,
      }));
  
      return { orders: formattedOrders };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
}
