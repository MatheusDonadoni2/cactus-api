import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { left } from '~/core/error/either';
import { LegalPerson } from '~backOffice/entities/legal.person';
import {
  ICreateRequest,
  ICreateResponse,
  ILegalPersonRepository,
} from '~backOffice/repositories/legal.person.repository';

interface IData extends LegalPerson {
  personId: string;
}

export class FakeLegalPersonRepository implements ILegalPersonRepository {
  private data: IData[];

  async create(props: ICreateRequest): Promise<ICreateResponse> {
    try {
      const legalPerson = LegalPerson.create({
        CNPJ: props.legalPerson.getCNPJ(),
      });

      const data = {
        personId: props.personId,
        ...legalPerson,
      } as IData;

      this.data.push(data);
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
