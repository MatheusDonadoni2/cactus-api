import { Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { Either, left, right } from 'src/core/error/either';
import { GenerateJWTTokenService } from 'src/infra/authentication/services/generate.jwt.token.service';

type AuthenticateUserServiceResponse = Either<
  InternalServerError,
  {
    access_token: string;
  }
>;

@Injectable()
export class AuthenticateUserService {
  constructor(private generateJWTTokenService: GenerateJWTTokenService) {}
  async execute(): Promise<AuthenticateUserServiceResponse> {
    const result = await this.generateJWTTokenService.execute({
      user: {
        name: 'matheus',
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
