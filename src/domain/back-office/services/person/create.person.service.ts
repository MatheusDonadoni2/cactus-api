import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/error/either';
import { Person } from '@backOffice/entities/person';
import { InternalServerError } from '@customErrors/internal-server-error';
import { PersonRepository } from '@infra/database/pg/repositories/person-repository';

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
