import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  checkGrpcConnection,
  createGrpcClient,
} from '../common/grpc/grpc-client';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  private rideClient: any; // Use `any` or create a proper type later

  async onModuleInit() {
    this.rideClient = createGrpcClient('RIDE_SERVICE');
    try {
      await checkGrpcConnection('RIDE_SERVICE');
    } catch (error) {
      console.error('❌ gRPC connection failed:', error);
    }
  }

  async requestRide(userId: number, pickup: string, dropoff: string) {
    return new Promise((resolve, reject) => {
      this.rideClient.RequestRide(
        { userId, pickup, dropoff },
        (err, response) => (err ? reject(err) : resolve(response)),
      );
    });
  }

  async getRideStatus(rideId: number) {
    return new Promise((resolve, reject) => {
      this.rideClient.GetRideStatus({ rideId }, (err, response) =>
        err ? reject(err) : resolve(response),
      );
    });
  }
}
