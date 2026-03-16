import { z } from 'zod';

const emptyToUndefined = (value: unknown) =>
  value === '' || value === undefined || value === null ? undefined : value;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB_NAME: z.string().min(1).default('app'),

  /** Optional — enable when you wire Postgres repositories. */
  POSTGRES_URI: z.preprocess(emptyToUndefined, z.string().min(1).optional()),

  /** Optional — enable when you register the Redis plugin. */
  REDIS_URI: z.preprocess(emptyToUndefined, z.string().min(1).optional()),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('*'),

  /** Optional object storage — not wired to routes by default. */
  STORAGE_PROVIDER: z.enum(['s3', 'azure', 'local']).default('local'),
  S3_BUCKET: z.preprocess(emptyToUndefined, z.string().optional()),
  S3_REGION: z.preprocess(emptyToUndefined, z.string().optional()),
  AWS_ACCESS_KEY_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  AWS_SECRET_ACCESS_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  AZURE_STORAGE_CONNECTION_STRING: z.preprocess(emptyToUndefined, z.string().optional()),
  LOCAL_STORAGE_PATH: z.string().default('./uploads'),

  RATE_LIMIT_MAX: z.coerce.number().min(1).default(100),
  RATE_LIMIT_TIME_WINDOW_MS: z.coerce.number().min(1000).default(60000),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment:\n${issues}`);
  }
  return parsed.data;
}

export const env = loadEnv();
