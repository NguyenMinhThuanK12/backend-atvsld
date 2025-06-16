import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { VersioningType } from '@nestjs/common'; //
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Thêm tiền tố /api vào tất cả route
  app.setGlobalPrefix('api');

  // Bật versioning theo URI: /v1, /v2...
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // Bật validation toàn app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ field dư
      transform: true,
      forbidNonWhitelisted: true, // ném lỗi nếu gửi field không được khai báo
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001', // URL của Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    credentials: true, // Cho phép gửi cookie hoặc header xác thực
  });

  await app.listen(3000);
}
bootstrap();
