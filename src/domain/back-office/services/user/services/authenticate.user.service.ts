import { Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { UsernameOrPasswordIncorrect } from 'src/core/error/custom-errors-class/username-or-password-incorrect';
import { Either, left, right } from 'src/core/error/either';
import { GenerateJWTTokenService } from 'src/infra/authentication/services/generate.jwt.token.service';
import { CryptographyService } from 'src/infra/cryptography/services/cryptography.service';

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
  private FAKE_USER = {
    id: '1',
    user_name: 'FAKE_USERNAME',
    fake_password: 'FAKE_PASSWORD',
  };

  constructor(
    private generateJWTTokenService: GenerateJWTTokenService,
    private cryptographyService: CryptographyService,
  ) {}
  async execute(
    props: AuthenticateUserServiceRequest,
  ): Promise<AuthenticateUserServiceResponse> {
    this.FAKE_USER.fake_password = await this.cryptographyService.hash(
      this.FAKE_USER.fake_password,
    );

    const { username, password } = props;

    if (!(username === this.FAKE_USER.user_name)) {
      return left(new UsernameOrPasswordIncorrect());
    }

    const isValidPassword = await this.cryptographyService.compare(
      password,
      this.FAKE_USER.fake_password,
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
