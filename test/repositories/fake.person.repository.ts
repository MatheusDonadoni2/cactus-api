import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { left, right } from '~/core/error/either';
import { Person } from '~backOffice/entities/person';
import {
  ICreateRequest,
  ICreateResponse,
  IGetByIdRequest,
  IGetByIdResponse,
  IPersonRepository,
} from '~backOffice/repositories/person.repository';
import { InternalServerError } from '~customErrors/internal-server-error';
import { ResourceNotFound } from '~customErrors/resource.not.found';

export class FakePersonRepository implements IPersonRepository {
  public data: Person[] = [];

  async create(props: ICreateRequest): Promise<ICreateResponse> {
    try {
      this.data.push(props.person);
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }

  async getById(props: IGetByIdRequest): Promise<IGetByIdResponse> {
    try {
      const person = this.data.find((person) =>
        person.id.equals(new UniqueEntityId(props.id)),
      );

      if (!person) {
        return left(new ResourceNotFound('person'));
      }

      return right({
        person,
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
