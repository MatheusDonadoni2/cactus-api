import { Module } from '@nestjs/common';
import { BcryptHasherService } from './services/criptografy.service';

@Module({
  exports: [BcryptHasherService],
})
export class CriptografyModule {}
