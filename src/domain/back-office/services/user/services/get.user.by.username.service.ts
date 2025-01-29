import { Injectable } from '@nestjs/common';

import { Either, left, right } from '~/core/error/either';
import { IUserRepository } from '~/domain/back-office/repositories/user.repository';
import { User } from '~backOffice/entities/user';
import { InternalServerError } from '~customErrors/internal-server-error';
import { ResourceNotFound } from '~customErrors/resource.not.found';

type GetUserServiceByUserNameServiceRequest = { username: string };
type GetUserServiceByUserNameServiceResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    user: User;
  }
>;

@Injectable()
export class GetUserServiceByUserNameService {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    username,
  }: GetUserServiceByUserNameServiceRequest): Promise<GetUserServiceByUserNameServiceResponse> {
    const resultGetByUsername = await this.userRepository.getByUsername({
      username,
    });

    if (resultGetByUsername.isLeft()) {
      return left(resultGetByUsername.value);
    }

    const { user } = resultGetByUsername.value;

    return right({ user });
  }
}
