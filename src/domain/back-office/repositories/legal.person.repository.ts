import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { Either } from '~/core/error/either';

import { LegalPerson } from '../entities/legal.person';

export type ICreateRequest = {
  personId: string;
  legalPerson: LegalPerson;
};

export type ICreateResponse = Either<InternalServerError, void>;

export type IGetByCNPJRequest = {
  cnpj: string;
};

export type IGetByCNPJResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    legalPerson: LegalPerson | undefined;
  }
>;

export abstract class ILegalPersonRepository {
  abstract create(props: ICreateRequest): Promise<ICreateResponse>;
  abstract getByCNPJ(props: IGetByCNPJRequest): Promise<IGetByCNPJResponse>;
}
