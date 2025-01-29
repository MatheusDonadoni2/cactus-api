import { UseCaseError } from '../use-case-error';

export class ResourceSentAreNotEnough extends Error implements UseCaseError {
  name: string;
  action?: string;
  statusCode?: number;

  constructor(message?: string) {
    super(message ? message : 'Resources sent are not enough.');

    this.name = 'RESOURCE_SENT_ARE_NOT_ENOUGH';
    this.action = 'Resources sent are not enough.';
    this.statusCode = 400;
  }
}
