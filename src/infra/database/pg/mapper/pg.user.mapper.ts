import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { LegalPerson } from '~/domain/back-office/entities/legal.person';
import { NaturalPerson } from '~/domain/back-office/entities/natural.person';
import { Person } from '~/domain/back-office/entities/person';
import { User } from '~/domain/back-office/entities/user';

import { IDefaultColumn } from '../@types/types';

export interface IUserDBResponse extends IDefaultColumn {
  username: string;
  password: string;
  person_id: string;
  person_name: string;
  legal_person_id: string;
  legal_person_cnpj: string;
  natural_person_id: string;
  natural_person_cpf: string;
}
export class PGUserMapper {
  static toDomain(props: IUserDBResponse) {
    const legalPerson = LegalPerson.create(
      {
        CNPJ: props.legal_person_cnpj,
      },
      new UniqueEntityId(props.legal_person_id),
    );

    const naturalPerson = NaturalPerson.create(
      {
        CPF: props.natural_person_cpf,
      },
      new UniqueEntityId(props.natural_person_id),
    );

    const person = Person.create(
      {
        name: props.person_name,
        legalPerson,
        naturalPerson,
      },
      new UniqueEntityId(props.person_id),
    );

    return User.create(
      {
        username: props.username,
        password: props.password,
        person,
      },
      new UniqueEntityId(props.id),
    );
  }
}
