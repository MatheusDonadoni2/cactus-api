import { Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { UsernameOrPasswordIncorrect } from 'src/core/error/custom-errors-class/username-or-password-incorrect';
import { Either, left, right } from 'src/core/error/either';
import { GenerateJWTTokenService } from 'src/infra/authentication/services/generate.jwt.token.service';
import { CryptographyService } from 'src/infra/cryptography/services/cryptography.service';
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

    if (username !== user.value.user.getUsername()) {
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
