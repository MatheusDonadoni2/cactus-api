import { UseCaseError } from '~/core/error/use-case-error';

export class ResourceIsInvalid extends Error implements UseCaseError {
  name: string;
  action?: string;
  statusCode?: number;

  constructor(message?: string) {
    super(message ? message : 'Resource is invalid.');

    this.name = 'RESOURCE_IS_INVALID';
    this.action = 'Resource is invalid.';
    this.statusCode = 400;
  }
}
