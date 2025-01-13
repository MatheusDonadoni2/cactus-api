import { UseCaseError } from '../use-case-error';

export class UsernameOrPasswordIncorrect extends Error implements UseCaseError {
  name: string;
  action?: string;
  statusCode?: number;

  constructor(message?: string) {
    super(message ? message : 'Username and/or password are incorrect.');

    this.name = 'USERNAME_PASSWORD_INCORRECT';
    this.action = 'Username and/or password are incorrect.';
    this.statusCode = 401;
  }
}
