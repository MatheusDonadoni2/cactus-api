import { Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { Either, left, right } from 'src/core/error/either';
import { Person } from 'src/domain/back-office/entities/person';
import { PersonRepository } from 'src/infra/database/pg/repositories/person-repository';

interface CreatePersonServiceRequest {
  name: string;
}

type CreatePersonServiceResponse = Either<
  InternalServerError,
  {
    person: Person;
  }
>;

@Injectable()
export class CreatePersonService {
  constructor(private personRepository: PersonRepository) {}
  async execute(
    props: CreatePersonServiceRequest,
  ): Promise<CreatePersonServiceResponse> {
    try {
      const { name } = props;

      const person = Person.create({ name });
      await this.personRepository.create(person);

      return right({
        person,
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
