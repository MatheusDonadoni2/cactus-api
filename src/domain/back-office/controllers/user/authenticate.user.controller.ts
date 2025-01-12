import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthenticateUserService } from '../../services/user/services/authenticate.user.service';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { Public } from 'src/infra/authentication/decorator/public.decorator';

@Controller('v1/users/auth')
export class AuthenticateUserController {
  constructor(private authenticateUserService: AuthenticateUserService) {}

  @Public()
  @Get()
  async handle() {
    const result = await this.authenticateUserService.execute();

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
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
