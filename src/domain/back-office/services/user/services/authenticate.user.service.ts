import { Injectable } from '@nestjs/common';

import { Either, left, right } from '~/core/error/either';
import { InternalServerError } from '~customErrors/internal-server-error';
import { UsernameOrPasswordIncorrect } from '~customErrors/username-or-password-incorrect';
import { GenerateJWTTokenService } from '~infra/authentication/services/generate.jwt.token.service';
import { CryptographyService } from '~infra/cryptography/services/cryptography.service';

import { GetUserServiceByUserNameService } from './get.user.service';

interface AuthenticateUserServiceRequest {
  username: string;
  password: string;
}

type AuthenticateUserServiceResponse = Either<
  InternalServerError | UsernameOrPasswordIncorrect,
  {
    access_token: string;
  }
>;

@Injectable()
export class AuthenticateUserService {
  constructor(
    private generateJWTTokenService: GenerateJWTTokenService,
    private cryptographyService: CryptographyService,
    private getUserServiceByUserNameService: GetUserServiceByUserNameService,
  ) {}
  async execute(
    props: AuthenticateUserServiceRequest,
  ): Promise<AuthenticateUserServiceResponse> {
    const { username, password } = props;

    const user = await this.getUserServiceByUserNameService.execute({
      username,
    });

    if (user.isLeft()) {
      return left(new UsernameOrPasswordIncorrect());
    }

    const isValidPassword = await this.cryptographyService.compare(
      password,
      user.value.user.getPassword(),
    );

    if (!isValidPassword) {
      return left(new UsernameOrPasswordIncorrect());
    }

    const result = await this.generateJWTTokenService.execute({
      user: {
        username,
      },
    });

    if (result.isLeft()) {
      return left(result.value);
    }

    const { access_token } = result.value;

    return right({
      access_token,
    });
  }
}
