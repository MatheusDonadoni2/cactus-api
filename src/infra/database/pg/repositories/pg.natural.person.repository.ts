import { Injectable } from '@nestjs/common';

import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { left, right } from '~/core/error/either';
import {
  ICreateRequest,
  ICreateResponse,
  IGetByCPFRequest,
  IGetByCPFResponse,
  INaturalPersonRepository,
} from '~/domain/back-office/repositories/natural.person.repository';
import { PGService } from '~infra/database/pg/pg.service';

import {
  INaturalPersonDBResponse,
  PGNaturalPersonMapper,
} from '../mapper/pg.natural.person.mapper';

@Injectable()
export class PGNaturalPersonRepository implements INaturalPersonRepository {
  constructor(private pgService: PGService) {}

  async create(props: ICreateRequest): Promise<ICreateResponse> {
    try {
      await this.pgService.queryWithTran({
        text: 'INSERT INTO natural_person(id, person_id, cpf) VALUES ($1, $2, $3)',
        values: [
          props.naturalPerson.id.toString(),
          props.personId,
          props.naturalPerson.getCPF(),
        ],
      });

      return right(undefined);
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
  async getByCPF(props: IGetByCPFRequest): Promise<IGetByCPFResponse> {
    try {
      const naturalPerson =
        await this.pgService.findOne<INaturalPersonDBResponse>({
          text: `SELECT * FROM natural_person where cpf = $1`,
          values: [props.cpf],
        });

      if (!naturalPerson) {
        return left(new ResourceNotFound('natural person'));
      }

      return right({
        naturalPerson: PGNaturalPersonMapper.toDomain(naturalPerson),
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
