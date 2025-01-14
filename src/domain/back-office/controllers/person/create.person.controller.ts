import { Controller, Post } from '@nestjs/common';
import { CreatePersonService } from '../../services/person/create.person.service';

@Controller('v1/persons')
export class CreatePersonController {
  constructor(private createPersonService: CreatePersonService) {}

  @Post()
  async handle() {
    return await this.createPersonService.execute();
  }
}
