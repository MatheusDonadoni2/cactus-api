import { Entity } from 'src/core/entities/entity';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

interface IPerson {
  name: string;
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
}
