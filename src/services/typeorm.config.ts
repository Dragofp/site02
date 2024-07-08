import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

declare const __dirname: string;

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'pass',
  database: process.env['DB_DATABASE'] || 'b1',
  entities: [path.join(__dirname, '../services/*.entity{.ts,.js}')],
  synchronize: true, // Not recommended in production
};
