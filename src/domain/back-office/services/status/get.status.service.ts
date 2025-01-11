import { Injectable } from '@nestjs/common';

import { PGStatusRepository } from 'src/infra/database/pg/repositories/pg-status-repository';
import { Status } from 'src/domain/back-office/entities/status';
import { Either, left, right } from 'src/core/error/either';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';

type GetStatusServiceResponse = Either<
  InternalServerError,
  {
    status: Status;
  }
>;

@Injectable()
export class GetStatusService {
  constructor(private statusRepository: PGStatusRepository) {}
  async execute(): Promise<GetStatusServiceResponse> {
    try {
      const status = await this.statusRepository.getStatus();
      return right({ status });
    } catch (error) {
      return left(new InternalServerError(error.message));
    }
  }
}
