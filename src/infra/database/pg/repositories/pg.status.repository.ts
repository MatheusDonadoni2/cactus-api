import { Injectable } from '@nestjs/common';

import { EnvService } from '~/infra/env/env.service';
import { Status } from '~backOffice/entities/status';
import { PGService } from '~infra/database/pg/pg.service';

@Injectable()
export class PGStatusRepository {
  constructor(
    private pgService: PGService,
    private envService: EnvService,
  ) {}

  async getStatus(): Promise<Status> {
    try {
      const updated_at = new Date().toISOString();

      const databaseVersionResult = await this.pgService.findManyWithoutTypes({
        text: 'SHOW server_version;',
      });
      const databaseVersionResultValue =
        databaseVersionResult.rows[0].server_version;

      const databaseMaxConnectionsResult =
        await this.pgService.findManyWithoutTypes({
          text: 'SHOW max_connections',
        });
      const databaseMaxConnectionsResultValue =
        databaseMaxConnectionsResult.rows[0].max_connections;

      const databaseName = this.envService.get('POSTGRES_DB');
      const databaseOpenedConnectionsResult =
        await this.pgService.findManyWithoutTypes({
          text: `SELECT COUNT(1)::int from pg_stat_activity WHERE datname = $1`,
          values: [databaseName],
        });
      const databaseOpenedConnectionsResultValue =
        databaseOpenedConnectionsResult.rows[0].count;

      return new Status({
        updated_at: updated_at,
        dependencies: {
          database: {
            version: databaseVersionResultValue,
            max_connections: parseInt(databaseMaxConnectionsResultValue),
            opened_connections: parseInt(databaseOpenedConnectionsResultValue),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
