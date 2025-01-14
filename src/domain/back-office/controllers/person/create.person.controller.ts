import { Controller, Post } from '@nestjs/common';
import { CreatePersonService } from '../../services/person/create.person.service';
import { Public } from 'src/infra/authentication/decorator/public.decorator';

@Controller('v1/persons')
export class CreatePersonController {
  constructor(private createPersonService: CreatePersonService) {}

  @Public()
  @Post()
  async handle() {
    return await this.createPersonService.execute();
  }
}
