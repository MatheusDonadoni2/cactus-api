import { z } from 'zod';

export const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().optional().default(5432),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PASSWORD: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
