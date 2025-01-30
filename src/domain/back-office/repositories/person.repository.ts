import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { Either } from '~/core/error/either';
import { PGTransaction } from '~infra/database/pg/transaction/pg.transactions';

import { Person } from '../entities/person';

export type ICreateRequest = {
  person: Person;
};

export type ICreateResponse = Either<InternalServerError, void>;

export type IGetByIdRequest = {
  id: string;
};

export type IGetByIdResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    person: Person;
  }
>;

export type IFetchAllResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    persons: Person[];
  }
>;

export abstract class IPersonRepository extends PGTransaction {
  abstract create(props: ICreateRequest): Promise<ICreateResponse>;
  abstract getById(props: IGetByIdRequest): Promise<IGetByIdResponse>;
  abstract fetchAll(): Promise<IFetchAllResponse>;
}
