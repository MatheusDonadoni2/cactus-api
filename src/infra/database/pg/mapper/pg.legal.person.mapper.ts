import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { LegalPerson } from '~/domain/back-office/entities/legal.person';

import { IDefaultColumn } from '../@types/types';

export interface ILegalPersonDBResponse extends IDefaultColumn {
  id: string;
  cnpj: string;
}

export class PGLegalPersonMapper {
  static toDomain(props: ILegalPersonDBResponse) {
    return LegalPerson.create(
      {
        CNPJ: props.cnpj,
      },
      new UniqueEntityId(props.id),
    );
  }
}
