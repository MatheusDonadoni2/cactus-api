import { Either } from '~/core/error/either';
import { InternalServerError } from '~customErrors/internal-server-error';

import { User } from '../entities/user';

export type ICreateRequest = { user: User };
export type ICreateResponse = Either<InternalServerError, void>;

export type IGetByUsernameRequest = {
  username: string;
};
export type IGetByUsernameResponse = Either<
  InternalServerError,
  { user: User }
>;

export abstract class IUserRepository {
  abstract create(props: ICreateRequest): Promise<ICreateResponse>;
  abstract getByUsername(
    props: IGetByUsernameRequest,
  ): Promise<IGetByUsernameResponse>;
}
