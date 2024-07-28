import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CheckoutCartDto } from './dto/checkout-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @ApiOperation({ summary: 'Add asset to cart' })
  @ApiResponse({
    status: 201,
    description: 'Asset added to cart successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. User ID or Asset ID missing.',
  })
  @ApiResponse({
    status: 404,
    description: 'Asset not found.',
  })
  @ApiBearerAuth()
  async addToCart(@Body() addToCartDto: CreateCartDto) {
    try {
      const quantity = addToCartDto?.quantity || 1;
      return await this.cartService.addToCart(
        addToCartDto.userId,
        addToCartDto.assetId,
        quantity,
      );
    } catch (error) {
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.response.message, HttpStatus.NOT_FOUND);
      } else if (error.response?.statusCode === HttpStatus.BAD_REQUEST)
        throw new HttpException(error.response.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'An error occurred while adding asset to cart',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('view')
  @ApiOperation({ summary: 'View cart items' })
  @ApiResponse({
    status: 200,
    description: 'Cart items retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. User ID missing.',
  })
  @ApiBearerAuth()
  async viewCart(@Query('userId', ParseIntPipe) userId: number) {
    try {
      return await this.cartService.viewCart(userId);
    } catch (error) {
      throw new HttpException(
        'An error occurred while retrieving cart items',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @ApiOperation({ summary: 'Checkout and purchase' })
  @ApiResponse({
    status: 200,
    description: 'Checkout successful.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. User ID or Cart ID missing.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found or already checked out.',
  })
  @ApiBearerAuth()
  async checkout(@Body() checkoutDto: CheckoutCartDto) {
    try {
      return await this.cartService.checkout(
        checkoutDto.userId,
        checkoutDto.cartId,
      );
    } catch (error) {
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.response.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'An error occurred during checkout',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
