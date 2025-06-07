import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';
import slugify from 'slugify';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY'),
    );
    this.bucket = this.configService.get<string>('SUPABASE_BUCKET_NAME');
  }

  async uploadPdf(fileBuffer: Buffer, originalName: string, oldUrl?: string): Promise<string> {
    if (oldUrl) {
      await this.deleteByUrl(oldUrl); //  Xoá file cũ nếu có
    }

    const cleanName = slugify(originalName, { lower: true, strict: true });
    const filePath = `departments/${cleanName}-${uuid()}.pdf`;

    const { data, error } = await this.supabase.storage.from(this.bucket).upload(filePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

    if (error) throw new Error(error.message);

    const { publicUrl } = this.supabase.storage.from(this.bucket).getPublicUrl(data.path).data;

    return publicUrl;
  }

  async uploadImage(fileBuffer: Buffer, originalName: string, oldUrl?: string): Promise<string> {
    if (oldUrl) {
      await this.deleteByUrl(oldUrl); // Xoá avatar cũ nếu có
    }

    const ext = originalName.split('.').pop(); // jpg, png...
    const cleanName = slugify(originalName, { lower: true, strict: true });
    const filePath = `avatars/${cleanName}-${uuid()}.${ext}`;

    const { data, error } = await this.supabase.storage.from(this.bucket).upload(filePath, fileBuffer, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`, // image/jpeg or image/png
      upsert: true,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { publicUrl } = this.supabase.storage.from(this.bucket).getPublicUrl(data.path).data;

    return publicUrl;
  }

  async deleteByUrl(fileUrl: string): Promise<void> {
    try {
      const baseUrl = `${this.configService.get<string>('SUPABASE_URL')}/storage/v1/object/public/${this.bucket}/`;
      const relativePath = fileUrl.replace(baseUrl, '');

      await this.supabase.storage.from(this.bucket).remove([relativePath]);
    } catch (error) {
      console.error(' Failed to delete old file:', error.message);
    }
  }
}
