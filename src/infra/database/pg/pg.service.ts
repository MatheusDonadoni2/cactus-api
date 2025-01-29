import { Injectable } from '@nestjs/common';
import { Client, QueryConfig } from 'pg';

import { EnvService } from '~infra/env/env.service';

@Injectable()
export class PGService {
  private client: Client;

  constructor(private envService: EnvService) {}
  private async getNewConnection() {
    const client = new Client({
      host: this.envService.get('POSTGRES_HOST'),
      port: this.envService.get('POSTGRES_PORT'),
      user: this.envService.get('POSTGRES_USER'),
      database: this.envService.get('POSTGRES_DB'),
      password: this.envService.get('POSTGRES_PASSWORD'),
    });

    await client.connect();

    return client;
  }

  async disconnect() {
    try {
      if (this.client !== undefined) {
        await this.client.end();
        this.client = undefined;
      }
    } catch (error) {
      throw error;
    }
  }

  async startTransaction() {
    try {
      if (!this.client) {
        this.client = await this.getNewConnection();
        await this.client.query('BEGIN');
      }
    } catch (error) {
      throw error;
    }
  }

  async commitTransaction() {
    try {
      if (this.client !== undefined) {
        await this.client.query('COMMIT');
      }
    } catch (error) {
      await this.rollBackTransaction();
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async rollBackTransaction() {
    try {
      if (this.client !== undefined) {
        await this.client.query('ROLLBACK');
      }
    } catch (error) {
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async queryWithTran(queryObject: QueryConfig) {
    try {
      return await this.client.query(queryObject);
    } catch (error) {
      await this.rollBackTransaction();
      throw error;
    }
  }

  async query(queryObject: QueryConfig) {
    const client = await this.getNewConnection();
    try {
      await client.query(queryObject);
    } catch (error) {
      throw error;
    } finally {
      client.end();
    }
  }

  async findOne<R>(queryObject: QueryConfig): Promise<R> {
    const client = await this.getNewConnection();
    try {
      const result = await client.query<R>(queryObject);
      return result.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.end();
    }
  }

  async findMany<R>(queryObject: QueryConfig): Promise<R[]> {
    const client = await this.getNewConnection();
    try {
      const result = await client.query<R>(queryObject);
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.end();
    }
  }

  async findManyWithoutTypes(queryObject: QueryConfig) {
    const client = await this.getNewConnection();
    try {
      return await client.query(queryObject);
    } catch (error) {
      throw error;
    } finally {
      client.end();
    }
  }
}
