import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật validation toàn app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ field dư
      forbidNonWhitelisted: true, // ném lỗi nếu gửi field không được khai báo
      transform: true, // tự ép kiểu theo DTO
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
