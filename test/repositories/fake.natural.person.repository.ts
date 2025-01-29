import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { left } from '~/core/error/either';
import { NaturalPerson } from '~backOffice/entities/natural.person';
import {
  ICreateRequest,
  ICreateResponse,
  INaturalPersonRepository,
} from '~backOffice/repositories/natural.person.repository';

interface IData extends NaturalPerson {
  personId: string;
}

export class FakeNaturalPersonRepository implements INaturalPersonRepository {
  private data: IData[];

  async create(props: ICreateRequest): Promise<ICreateResponse> {
    try {
      const naturalPerson = NaturalPerson.create({
        CPF: props.naturalPerson.getCPF(),
      });

      const data = {
        personId: props.personId,
        ...naturalPerson,
      } as IData;

      this.data.push(data);
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
