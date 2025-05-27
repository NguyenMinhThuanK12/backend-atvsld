import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file): Promise<Record<string, string>> => {
    const ext = path.extname(file.originalname); // lấy đuôi file (.pdf)
    const baseName = file.fieldname; // businessLicense

    return {
      folder: 'departments',
      resource_type: 'raw',
      public_id: `${baseName}-${Date.now()}${ext}`, // ➕ thêm đuôi tại đây
    };
  },
});
//
