import { Module } from '@nestjs/common';

import { CryptographyService } from '~infra/cryptography/services/cryptography.service';

@Module({
  providers: [CryptographyService],
  exports: [CryptographyService],
})
export class CryptographyModule {}
