import { Entity } from '~/core/entities/entity';
import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { Person } from '~backOffice/entities/person';

export interface IUser {
  person: Person;
  password: string;
  username: string;
}
export class User extends Entity<IUser> {
  static create(props: IUser, id?: UniqueEntityId) {
    return new User(props, id);
  }

  setPerson(value: Person) {
    this.props.person = value;
  }

  getPerson() {
    return this.props.person;
  }

  setPassword(value: string) {
    this.props.password = value;
  }

  getPassword() {
    return this.props.password;
  }

  setUsername(value: string) {
    this.props.username = value;
  }

  getUsername() {
    return this.props.username;
  }
}
