import { UseCaseError } from '~/core/error/use-case-error';

export class ResourceNotFound extends Error implements UseCaseError {
  name: string;
  action?: string;
  statusCode?: number;

  constructor(message?: string) {
    super(message ? message : 'Resource not found.');

    this.name = 'RESOURCE_NOT_FOUND';
    this.action = 'Resource not found.';
    this.statusCode = 404;
  }
}
