import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { Either } from '~/core/error/either';

import { NaturalPerson } from '../entities/natural.person';

export type ICreateRequest = {
  personId: string;
  naturalPerson: NaturalPerson;
};

export type ICreateResponse = Either<InternalServerError, void>;

export type IGetByCPFRequest = {
  cpf: string;
};

export type IGetByCPFResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    naturalPerson: NaturalPerson | undefined;
  }
>;

export abstract class INaturalPersonRepository {
  abstract create(props: ICreateRequest): Promise<ICreateResponse>;
  abstract getByCPF(props: IGetByCPFRequest): Promise<IGetByCPFResponse>;
}
