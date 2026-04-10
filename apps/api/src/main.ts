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

  const allowedOrigins = [
    process.env.APP_URL ?? 'http://localhost:3000',
    process.env.WIDGET_URL ?? 'http://localhost:5173',
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // In development allow any localhost port (useful for local HTML test servers)
      if (
        process.env.NODE_ENV !== 'production' &&
        origin &&
        /^https?:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, true);
        return;
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`API running on port ${port}`);
}

void bootstrap();
