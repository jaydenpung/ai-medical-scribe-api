import { DataSource } from 'typeorm';
import { Consult } from '../entities/consult.entity';
import { Recording } from '../entities/recording.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Consult, Recording],
  synchronize: true,
});