import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  // pg v8+ on Windows treats sslmode=require as verify-full and fails with
  // Supabase's pooler certs. Disable strict cert verification in non-production.
  // In production supply a proper CA cert instead.
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  // rawBody: true exposes req.rawBody for Stripe webhook signature verification
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(helmet());

  // Widget is embedded on arbitrary client websites — any origin must be allowed at
  // the CORS level. The real per-bot domain gate is DomainWhitelistGuard which checks
  // bot.allowedDomains against the Origin header on every public widget endpoint.
  // The API uses JWT Bearer tokens (not cookies), so CORS is not a security boundary.
  app.enableCors({
    origin: (
      _origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, true);
    },
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`API running on port ${port}`);
}

void bootstrap();
