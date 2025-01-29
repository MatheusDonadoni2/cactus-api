import { Injectable } from '@nestjs/common';

import { left, right } from '~/core/error/either';
import {
  ICreateRequest,
  IGetByCNPJRequest,
  IGetByCNPJResponse,
  ILegalPersonRepository,
} from '~backOffice/repositories/legal.person.repository';
import { ICreateResponse } from '~backOffice/repositories/person.repository';
import { InternalServerError } from '~customErrors/internal-server-error';
import { ResourceNotFound } from '~customErrors/resource.not.found';

import {
  ILegalPersonDBResponse,
  PGLegalPersonMapper,
} from '../mapper/pg.legal.person.mapper';
import { PGService } from '../pg.service';

@Injectable()
export class PGLegalPersonRepository implements ILegalPersonRepository {
  constructor(private pgService: PGService) {}

  async create(props: ICreateRequest): Promise<ICreateResponse> {
    try {
      await this.pgService.queryWithTran({
        text: 'INSERT INTO legal_person(id, person_id, cnpj) VALUES($1, $2, $3)',
        values: [
          props.legalPerson.id.toString(),
          props.personId,
          props.legalPerson.getCNPJ(),
        ],
      });

      return right(undefined);
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }

  async getByCNPJ(props: IGetByCNPJRequest): Promise<IGetByCNPJResponse> {
    try {
      const legalPerson = await this.pgService.findOne<ILegalPersonDBResponse>({
        text: `SELECT * FROM legal_person where cnpj = $1`,
        values: [props.cnpj],
      });

      if (!legalPerson) {
        return left(new ResourceNotFound('legal person'));
      }

      return right({
        legalPerson: PGLegalPersonMapper.toDomain(legalPerson),
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
