import { Injectable } from '@nestjs/common';

import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { left, right } from '~/core/error/either';
import {
  ICreateRequest,
  ICreateResponse,
  IGetByUsernameRequest,
  IGetByUsernameResponse,
  IUserRepository,
} from '~/domain/back-office/repositories/user.repository';
import { PGService } from '~infra/database/pg/pg.service';

import { IUserDBResponse, PGUserMapper } from '../mapper/pg.user.mapper';

@Injectable()
export class PGUserRepository implements IUserRepository {
  constructor(private pgService: PGService) {}
  async create(props: ICreateRequest): Promise<ICreateResponse> {
    try {
      await this.pgService.query({
        text: `INSERT INTO users(id, person_id, username, password) VALUES($1, $2, $3, $4);`,
        values: [
          props.user.id.toString(),
          props.user.getPerson().id.toString(),
          props.user.getUsername(),
          props.user.getPassword(),
        ],
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
  async getByUsername(
    props: IGetByUsernameRequest,
  ): Promise<IGetByUsernameResponse> {
    try {
      const result = await this.pgService.findOne<IUserDBResponse>({
        text: `
            SELECT
               u.*
              ,P.id as person_id
              ,P.name as person_name
              ,LP.id as legal_person_id
              ,LP.cnpj as legal_person_cnpj
              ,NP.id as natural_person_id
              ,NP.cpf as natural_person_cpf
            FROM users U
              INNER JOIN persons P on
                p.id = U.person_id

              LEFT JOIN legal_person LP ON
                LP.person_id = P.id
              
              LEFT JOIN natural_person NP ON
                NP.person_id = P.id                

            WHERE 
              username = $1
          `,
        values: [props.username],
      });
      if (!result) {
        return left(new ResourceNotFound('user'));
      }

      return right({
        user: PGUserMapper.toDomain(result),
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
