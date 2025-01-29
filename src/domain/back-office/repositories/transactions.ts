import { PGService } from '~/infra/database/pg/pg.service';

export abstract class PGTransaction {
  constructor(protected readonly pgService: PGService) {}

  async startTransaction() {
    await this.pgService.startTransaction();
  }

  async commitTransaction() {
    await this.pgService.commitTransaction();
  }

  async rollbackTransaction() {
    await this.pgService.rollBackTransaction();
  }
}
