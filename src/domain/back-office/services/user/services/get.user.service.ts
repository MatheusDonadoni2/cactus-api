import { Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from 'src/core/error/custom-errors-class/resource.not.found';
import { Either, left, right } from 'src/core/error/either';
import { User } from 'src/domain/back-office/entities/user';
import { UserRepository } from 'src/infra/database/pg/repositories/user.repository';

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
