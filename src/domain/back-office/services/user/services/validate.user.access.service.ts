import { Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { Either, right } from 'src/core/error/either';

type ValidateUserAccessServicesResponse = Either<
  InternalServerError,
  {
    access_token: string;
  }
>;

@Injectable()
export class ValidateUserAccessServices {
  async execute(): Promise<ValidateUserAccessServicesResponse> {
    const access_token = 'access_token';

    return right({
      access_token,
    });
  }
}
