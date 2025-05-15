export default () => ({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '3008',
    database: 'atvsld_dev',
    synchronize: true,
    autoLoadEntities: true,
  },
});
