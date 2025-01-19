import { Client, QueryConfig } from 'pg';
import { Injectable } from '@nestjs/common';
import { EnvService } from '@infra/env/env.service';

@Injectable()
export class PGService {
  private client: Client;

  constructor(private envService: EnvService) {}

  private getNewConnection(): Client {
    const client = new Client({
      host: this.envService.get('POSTGRES_HOST'),
      port: this.envService.get('POSTGRES_PORT'),
      user: this.envService.get('POSTGRES_USER'),
      database: this.envService.get('POSTGRES_DB'),
      password: this.envService.get('POSTGRES_PASSWORD'),
    });

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
