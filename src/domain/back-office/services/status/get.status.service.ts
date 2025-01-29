import { Injectable } from '@nestjs/common';

import { Either, left, right } from '~/core/error/either';
import { PGStatusRepository } from '~/infra/database/pg/repositories/pg.status.repository';
import { Status } from '~backOffice/entities/status';
import { InternalServerError } from '~customErrors/internal-server-error';

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
