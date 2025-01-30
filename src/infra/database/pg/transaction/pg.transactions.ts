import { ITransactionsFunctions } from '~/core/database/transaction/transaction';
import { PGService } from '~/infra/database/pg/pg.service';

export abstract class PGTransaction implements ITransactionsFunctions {
  constructor(protected readonly pgService: PGService) {}

  async startTransaction() {
    await this.pgService.startTransaction();
  }

  async commitTransaction() {
    await this.pgService.commitTransaction();
  }

  async rollbackTransaction() {
    await this.pgService.rollbackTransaction();
  }
}
