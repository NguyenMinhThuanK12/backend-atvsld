import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const config: ConfigOptions = {
      cloud_name: this.configService.get<string>('cloudinary.cloud_name'),
      api_key: this.configService.get<string>('cloudinary.api_key'),
      api_secret: this.configService.get<string>('cloudinary.api_secret'),
    };
    cloudinary.config(config);
  }

  getInstance() {
    return cloudinary;
  }
}
