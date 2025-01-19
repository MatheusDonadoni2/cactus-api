import { Body, Controller, Post } from '@nestjs/common';
import { CreatePersonService } from '@backOffice/services/person/create.person.service';

interface CreatePersonControllerRequest {
  name: string;
}

@Controller('v1/persons')
export class CreatePersonController {
  constructor(private createPersonService: CreatePersonService) {}

  @Post()
  async handle(@Body() body: CreatePersonControllerRequest) {
    const { name } = body;
    return await this.createPersonService.execute({ name });
  }
}
