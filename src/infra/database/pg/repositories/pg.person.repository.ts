import { Injectable } from '@nestjs/common';

import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { left, right } from '~/core/error/either';
import {
  ICreateRequest,
  ICreateResponse,
  IFetchAllResponse,
  IGetByIdRequest,
  IGetByIdResponse,
  IPersonRepository,
} from '~/domain/back-office/repositories/person.repository';
import { PGTransaction } from '~/domain/back-office/repositories/transactions';
import { PGService } from '~infra/database/pg/pg.service';

import { IPersonDBResponse, PGPersonMapper } from '../mapper/pg.person.mapper';

@Injectable()
export class PGPersonRepository
  extends PGTransaction
  implements IPersonRepository
{
  constructor(pgService: PGService) {
    super(pgService);
  }

  async create(props: ICreateRequest): Promise<ICreateResponse> {
    try {
      await this.pgService.queryWithTran({
        text: `INSERT INTO persons(id, name) VALUES($1, $2)`,
        values: [props.person.id.toString(), props.person.getName()],
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }

  async getById(props: IGetByIdRequest): Promise<IGetByIdResponse> {
    try {
      const personOnDatabase = await this.pgService.findOne<IPersonDBResponse>({
        text: `
          SELECT
            P.*
            ,LP.id AS legal_person_id
            ,LP.cnpj AS legal_person_cnpj
            ,NP.id AS natural_person_id
            ,NP.cpf natural_person_cpf
          FROM PERSONS P
            LEFT JOIN legal_person LP ON
              LP.person_id = P.id
            LEFT JOIN natural_person NP ON
              NP.person_id = P.id
  
          WHERE
            P.id = $1
        `,
        values: [props.id],
      });

      if (!personOnDatabase) {
        return left(new ResourceNotFound('person'));
      }

      const person = PGPersonMapper.toDomain(personOnDatabase);

      return right({
        person,
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }

  async fetchAll(): Promise<IFetchAllResponse> {
    try {
      const personOnDatabase = await this.pgService.findMany<IPersonDBResponse>(
        {
          text: `
          SELECT
            P.*
            ,LP.id AS legal_person_id
            ,LP.cnpj AS legal_person_cnpj
            ,NP.id AS natural_person_id
            ,NP.cpf natural_person_cpf
          FROM PERSONS P
            LEFT JOIN legal_person LP ON
              LP.person_id = P.id
            LEFT JOIN natural_person NP ON
              NP.person_id = P.id
        `,
        },
      );

      if (!personOnDatabase) {
        return left(new ResourceNotFound('person'));
      }

      const persons = personOnDatabase.map(PGPersonMapper.toDomain);

      return right({
        persons,
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
