import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'postgres',
  host: `${process.env.HOST}`,
  port: `${process.env.PORT}`,
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  database: `${process.env.DATABASE}`,
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
