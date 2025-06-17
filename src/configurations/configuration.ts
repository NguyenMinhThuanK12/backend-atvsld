export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '3008',
    database: process.env.DB_NAME || 'atvsld_dev',
    autoLoadEntities: true,
    ssl: {
      rejectUnauthorized: false, // BẮT BUỘC với Render
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'access_default_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_default_secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    anon_key: process.env.SUPABASE_ANON_KEY,
    bucket: process.env.SUPABASE_BUCKET_NAME,
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3001',
  },
  authDisabled: process.env.AUTH_DISABLED === 'true',
  permissionDisabled: process.env.PERMISSION_DISABLED === 'true',
});
