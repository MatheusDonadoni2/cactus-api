import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { Public } from '@infra/authentication/decorator/public.decorator';
import { InternalServerError } from '@customErrors/internal-server-error';
import { UsernameOrPasswordIncorrect } from '@customErrors/username-or-password-incorrect';
import { AuthenticateUserService } from '@backOffice/services/user/services/authenticate.user.service';

type AuthenticateUserControllerDTO = {
  username: string;
  password: string;
};

@Controller('v1/users/auth')
export class AuthenticateUserController {
  constructor(private authenticateUserService: AuthenticateUserService) {}

  @Public()
  @Get()
  async handle(@Body() body: AuthenticateUserControllerDTO) {
    const result = await this.authenticateUserService.execute({
      username: body.username,
      password: body.password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UsernameOrPasswordIncorrect:
          throw new UnauthorizedException();
        case InternalServerError:
          throw new InternalServerErrorException();
        default:
          throw new BadRequestException();
      }
    }

    const { access_token } = result.value;
    return {
      data: {
        access_token,
      },
    };
  }
}
