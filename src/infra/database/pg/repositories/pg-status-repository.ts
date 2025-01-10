import { Injectable } from '@nestjs/common';
import { PGService } from '../pg.service';
import { Status } from 'src/domain/back-office/entities/status';

@Injectable()
export class PGStatusRepository {
  constructor(private pgService: PGService) {}

  async getStatus(): Promise<Status> {
    try {
      const updated_at = new Date().toISOString();

      const databaseVersionResult = await this.pgService.query({
        text: 'SHOW server_version;',
      });
      const databaseVersionResultValue =
        databaseVersionResult.rows[0].server_version;

      const databaseMaxConnectionsResult = await this.pgService.query({
        text: 'SHOW max_connections',
      });
      const databaseMaxConnectionsResultValue =
        databaseMaxConnectionsResult.rows[0].max_connections;

      const databaseName = process.env.POSTGRES_DB;
      const databaseOpenedConnectionsResult = await this.pgService.query({
        text: `SELECT COUNT(1)::int from pg_stat_activity WHERE datname = $1`,
        values: [databaseName],
      });
      const databaseOpenedConnectionsResultValue =
        databaseOpenedConnectionsResult.rows[0].count;

      const status = new Status({
        updated_at: updated_at,
        dependencies: {
          database: {
            version: databaseVersionResultValue,
            max_connections: parseInt(databaseMaxConnectionsResultValue),
            opened_connections: parseInt(databaseOpenedConnectionsResultValue),
          },
        },
      });
      return status;
    } catch (error) {
      throw error;
    }
  }
}
