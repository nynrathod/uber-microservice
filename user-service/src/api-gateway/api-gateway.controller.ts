import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller('api')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('ride/request')
  async requestRide(
    @Body() body: { userId: number; pickup: string; dropoff: string },
  ) {
    return this.apiGatewayService.requestRide(
      body.userId,
      body.pickup,
      body.dropoff,
    );
  }

  @Get('ride/status/:rideId')
  async getRideStatus(@Param('rideId') rideId: number) {
    return this.apiGatewayService.getRideStatus(Number(rideId));
  }
}
