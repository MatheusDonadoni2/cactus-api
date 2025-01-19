import { Entity } from '~/core/entities/entity';
import { UniqueEntityId } from '~/core/entities/unique-entity-id';

interface INaturalPerson {
  CPF: string;
}

export class NaturalPerson extends Entity<INaturalPerson> {
  static create(props: INaturalPerson, id?: UniqueEntityId) {
    return new NaturalPerson(props, id);
  }

  setCPF(value: string) {
    this.props.CPF = value;
  }

  getCPF() {
    return this.props.CPF;
  }
}
