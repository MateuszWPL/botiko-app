import 'dotenv/config';
// Sentry must be imported BEFORE NestFactory for instrumentation hooks to register.
import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';

/**
 * Audit B13: differentiated CORS policy per path.
 *
 * Public widget paths (/chat, /leads, /bot/:id/config, /contact,
 * /billing/webhook) must be reachable from arbitrary client websites.
 * The real per-bot domain gate is DomainWhitelistGuard.
 *
 * Dashboard API paths (auth, knowledge, tenant, billing/checkout|portal|status)
 * are called only from the Next.js dashboard. Restricting CORS to APP_URL
 * provides defence-in-depth against CSRF if cookies are ever introduced.
 *
 * The API today uses JWT Bearer tokens (not cookies), so CORS is not an
 * active security boundary — but the explicit intent is documented here.
 *
 * Implementation note: NestJS's enableCors callback only receives `origin`,
 * not the full request, so path-differentiation requires a raw Express
 * middleware applied before NestJS's CORS handler.
 */
const WIDGET_PATH =
  /^\/api\/v1\/(chat|leads|bot\/[^/]+\/config|contact|billing\/webhook)/;

function buildCorsMiddleware(appUrl: string) {
  const openCors = cors({ origin: true, credentials: true });
  const restrictedCors = cors({
    origin: (origin, cb) => {
      if (!origin || origin === appUrl) return cb(null, true);
      if (
        process.env.NODE_ENV !== 'production' &&
        origin.startsWith('http://localhost')
      ) {
        return cb(null, true);
      }
      cb(null, false);
    },
    credentials: true,
  });

  return (req: Request, res: Response, next: NextFunction) => {
    if (WIDGET_PATH.test(req.path)) {
      openCors(req, res, next);
    } else {
      restrictedCors(req, res, next);
    }
  };
}

async function bootstrap() {
  // pg v8+ on Windows treats sslmode=require as verify-full and fails with
  // Supabase's pooler certs. Disable strict cert verification in non-production.
  // In production supply a proper CA cert instead.
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  // rawBody: true exposes req.rawBody for Stripe webhook signature verification
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Railway (and most PaaS) terminate TLS at a reverse proxy. Without this,
  // req.ip is always the proxy IP → ThrottlerGuard buckets all clients together.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.use(helmet());

  // Apply path-aware CORS before NestJS processes the request.
  // We disable NestJS's built-in CORS and manage it manually.
  app.use(buildCorsMiddleware(env.APP_URL));

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`API running on port ${port}`);
}

void bootstrap();
