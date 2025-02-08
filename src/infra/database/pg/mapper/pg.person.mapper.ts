import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { LegalPerson } from '~/domain/back-office/entities/legal.person';
import { NaturalPerson } from '~/domain/back-office/entities/natural.person';
import { Person } from '~/domain/back-office/entities/person';

import { IDefaultColumn } from '../@types/types';

export interface IPersonDBResponse extends IDefaultColumn {
  id: string;
  name: string;
  legal_person_id?: string;
  legal_person_cnpj?: string;
  natural_person_id?: string;
  natural_person_cpf?: string;
}

export class PGPersonMapper {
  private static withOnlyLegalPerson(person: IPersonDBResponse) {
    return Person.create(
      {
        name: person.name,
        legalPerson: LegalPerson.create(
          {
            CNPJ: person.legal_person_cnpj,
          },
          new UniqueEntityId(person.legal_person_id),
        ),
      },
      new UniqueEntityId(person.id),
    );
  }

  private static withOnlyNaturalPerson(person: IPersonDBResponse) {
    return Person.create(
      {
        name: person.name,
        naturalPerson: NaturalPerson.create(
          {
            CPF: person.natural_person_cpf,
          },
          new UniqueEntityId(person.natural_person_id),
        ),
      },
      new UniqueEntityId(person.id),
    );
  }

  private static withoutBoth(person: IPersonDBResponse) {
    return Person.create(
      {
        name: person.name,
      },
      new UniqueEntityId(person.id),
    );
  }

  private static withLegalPersonAndNaturalPerson(person: IPersonDBResponse) {
    return Person.create(
      {
        name: person.name,
        legalPerson: LegalPerson.create(
          {
            CNPJ: person.legal_person_cnpj,
          },
          new UniqueEntityId(person.legal_person_id),
        ),
        naturalPerson: NaturalPerson.create(
          {
            CPF: person.natural_person_cpf,
          },
          new UniqueEntityId(person.natural_person_id),
        ),
      },
      new UniqueEntityId(person.id),
    );
  }

  static toDomain(person: IPersonDBResponse) {
    const legalPersonExists = person.legal_person_id;
    const naturalPersonExists = person.natural_person_id;

    if (legalPersonExists && !naturalPersonExists) {
      return this.withOnlyLegalPerson(person);
    } else if (!legalPersonExists && naturalPersonExists) {
      return this.withOnlyNaturalPerson(person);
    } else if (!legalPersonExists && !naturalPersonExists) {
      return this.withoutBoth(person);
    } else {
      return this.withLegalPersonAndNaturalPerson(person);
    }
  }
}
