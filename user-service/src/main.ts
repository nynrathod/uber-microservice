import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  console.log('mypath', path.resolve(__dirname, '../../proto/ride.proto'));
  app.useGlobalGuards(app.get(AuthGuard));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
