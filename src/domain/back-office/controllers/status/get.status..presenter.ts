import { Status } from '~backOffice/entities/status';

export interface IPresenterGetStatus {
  updated_at: string;
  dependencies: {
    database: {
      version: number;
      max_connections: number;
      opened_connections: number;
    };
  };
}

export abstract class Presenter {
  static getStatus(statusDTO: Status): IPresenterGetStatus {
    return {
      updated_at: statusDTO.getUpdatedAt(),
      dependencies: {
        database: {
          version: statusDTO.getDependencies().database.version,
          max_connections: statusDTO.getDependencies().database.max_connections,
          opened_connections:
            statusDTO.getDependencies().database.opened_connections,
        },
      },
    };
  }
}
