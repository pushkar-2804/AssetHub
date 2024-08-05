import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateCartDto } from './dto/update-cart.dto';

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
    description: 'Bad request. Asset ID missing.',
  })
  @ApiResponse({
    status: 404,
    description: 'Asset not found.',
  })
  @ApiBearerAuth()
  async addToCart(@Req() req, @Body() addToCartDto: CreateCartDto) {
    try {
      const quantity = addToCartDto?.quantity || 1;
      return await this.cartService.addToCart(
        req.user.userId,
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
  @ApiBearerAuth()
  async viewCart(@Req() req) {
    try {
      return await this.cartService.viewCart(+req.user.userId);
    } catch (error) {
      throw new HttpException(
        'An error occurred while retrieving cart items',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @ApiOperation({ summary: 'Update cart' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Cart or cart item not found.' })
  @ApiBearerAuth()
  async updateCart(@Req() req, @Body() updateCartDto: UpdateCartDto) {
    try {
      return await this.cartService.updateCart(+req.user.userId, updateCartDto);
    } catch (error) {
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.response.message, HttpStatus.NOT_FOUND);
      } else if (error.response?.statusCode === HttpStatus.BAD_REQUEST) {
        throw new HttpException(error.response.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'An error occurred while updating the cart',
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
    description: 'Bad request. Cart ID missing.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found or already checked out.',
  })
  @ApiBearerAuth()
  async checkout(@Req() req) {
    try {
      return await this.cartService.checkout(+req.user.userId);
    } catch (error) {
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.response.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
