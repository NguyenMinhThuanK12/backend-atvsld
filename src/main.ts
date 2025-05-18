import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật validation toàn app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // loại bỏ field dư
      forbidNonWhitelisted: true, // ném lỗi nếu gửi field không được khai báo
      transform: true,            // tự ép kiểu theo DTO
    }),
  );
  await app.listen(3000);
}
bootstrap();
