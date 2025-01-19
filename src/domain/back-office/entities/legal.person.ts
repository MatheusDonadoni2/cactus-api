import { Entity } from '~/core/entities/entity';
import { UniqueEntityId } from '~/core/entities/unique-entity-id';

interface ILegalPerson {
  CNPJ: string;
}

export class LegalPerson extends Entity<ILegalPerson> {
  static create(props: ILegalPerson, id?: UniqueEntityId) {
    return new LegalPerson(props, id);
  }

  setCNPJ(value: string) {
    this.props.CNPJ = value;
  }

  getCNPJ() {
    return this.props.CNPJ;
  }
}
