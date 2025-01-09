import { Injectable } from '@nestjs/common';

import { PGStatusRepository } from '../../../../infra/database/pg/repositories/pg-status-repository';
import { Status } from '../../../back-office/entities/status';

@Injectable()
export class GetStatusService {
  constructor(private statusRepository: PGStatusRepository) {}
  async execute(): Promise<Status> {
    const status = await this.statusRepository.getStatus();

    return status;
  }
}
