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
  static toDomain(props: IPersonDBResponse) {
    return Person.create(
      {
        name: props.name,
        legalPerson: LegalPerson.create(
          {
            CNPJ: props.legal_person_cnpj,
          },
          new UniqueEntityId(props.legal_person_id),
        ),
        naturalPerson: NaturalPerson.create(
          {
            CPF: props.natural_person_cpf,
          },
          new UniqueEntityId(props.natural_person_id),
        ),
      },
      new UniqueEntityId(props.id),
    );
  }
}
