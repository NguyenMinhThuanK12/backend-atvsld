export default () => ({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '3008',
    database: 'atvsld_dev',
    autoLoadEntities: true,
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

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3001',
  },
});
