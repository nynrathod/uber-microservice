import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    // UserModule,
    AuthModule,
    ApiGatewayModule,
    // WebsocketModule,
    // ApiGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
