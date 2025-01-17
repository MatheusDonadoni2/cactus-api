import { execSync } from 'child_process';
import { Client } from 'pg';

export abstract class DatabaseService {
  static async start() {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    });
    try {
      await client.connect();
      await client.query('drop schema public cascade; create schema public;');

      execSync('npm run migrations:up');
    } catch (error) {
      console.log(error);
    } finally {
      client.end();
    }
  }
}
