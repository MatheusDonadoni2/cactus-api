import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { Either, left, right } from 'src/core/error/either';

type GenerateJWTTokenServiceResponse = Either<
  InternalServerError,
  {
    access_token: string;
  }
>;

@Injectable()
export class GenerateJWTTokenService {
  constructor(private jwtService: JwtService) {}

  async execute(payload: object): Promise<GenerateJWTTokenServiceResponse> {
    try {
      const access_token = await this.jwtService.signAsync(payload);

      return right({
        access_token,
      });
    } catch (error) {
      console.error(error);
      return left(new InternalServerError(error));
    }
  }
}
