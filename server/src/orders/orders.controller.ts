import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { CartService } from 'src/cart/cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly cartService: CartService) {}

  // Protecting the route with JWT authentication
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'View orders' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
  })
  @ApiBearerAuth()
  async getOrderDetails(@Param('userId') userId: number) {
    try {
      const orders = await this.cartService.getMyOrders(userId);

      return {
        status: 'success',
        data: orders,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to fetch orders',
      };
    }
  }
}
