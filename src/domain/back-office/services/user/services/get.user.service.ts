import { Injectable } from '@nestjs/common';

import { Either, left, right } from '~/core/error/either';
import { UserRepository } from '~/infra/database/pg/repositories/user.repository';
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
  constructor(private userRepository: UserRepository) {}

  async execute({
    username,
  }: GetUserServiceByUserNameServiceRequest): Promise<GetUserServiceByUserNameServiceResponse> {
    const user = await this.userRepository.getByUsername(username);

    if (user) {
      return right({ user });
    } else {
      return left(new ResourceNotFound('Resource not found: user.'));
    }
  }
}
