import { Module } from '@nestjs/common';
import { CryptographyService } from './services/cryptography.service';

@Module({
  providers: [CryptographyService],
  exports: [CryptographyService],
})
export class CryptographyModule {}
