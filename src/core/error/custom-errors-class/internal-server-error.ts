import { UseCaseError } from '../use-case-error';

export class InternalServerError extends Error implements UseCaseError {
  name: string;
  action?: string;
  statusCode?: number;

  constructor(message?: string) {
    super(message ? message : 'An unexpected error occurred');

    this.name = 'UNEXPECTED_ERROR';
    this.action = 'Internal server error';
    this.statusCode = 500;
  }
}
