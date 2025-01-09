import { Client, QueryConfig } from 'pg';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PGService {
  private client: Client;

  private getNewConnection(): Client {
    const client = (this.client = new Client({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    }));

    return client;
  }

  async query(queryObject: QueryConfig) {
    try {
      this.client = this.getNewConnection();
      await this.client.connect();
      return await this.client.query(queryObject);
    } catch (error) {
      throw error;
    } finally {
      await this.client.end();
    }
  }
}
