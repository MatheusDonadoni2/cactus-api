import { Entity } from '~/core/entities/entity';
import { UniqueEntityId } from '~/core/entities/unique-entity-id';

import { LegalPerson } from './legal.person';
import { NaturalPerson } from './natural.person';

export interface IPerson {
  name: string;
  naturalPerson?: NaturalPerson;
  legalPerson?: LegalPerson;
}

export class Person extends Entity<IPerson> {
  static create(props: IPerson, id?: UniqueEntityId) {
    return new Person(props, id);
  }

  setName(value: string) {
    this.props.name = value;
  }

  getName() {
    return this.props.name;
  }

  setNaturalPerson(value: NaturalPerson) {
    this.props.naturalPerson = value;
  }

  getNaturalPerson() {
    return this.props.naturalPerson;
  }

  setLegalPerson(value: LegalPerson) {
    this.props.legalPerson = value;
  }

  getLegalPerson() {
    return this.props.legalPerson;
  }
}
