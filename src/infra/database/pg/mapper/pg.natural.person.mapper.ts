import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { NaturalPerson } from '~/domain/back-office/entities/natural.person';

import { IDefaultColumn } from '../@types/types';

export interface INaturalPersonDBResponse extends IDefaultColumn {
  id: string;
  cpf: string;
}

export class PGNaturalPersonMapper {
  static toDomain(props: INaturalPersonDBResponse) {
    return NaturalPerson.create(
      {
        CPF: props.cpf,
      },
      new UniqueEntityId(props.id),
    );
  }
}
