import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from '../config/env';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // pg v8.20+ changed sslmode=require to behave like verify-full, causing
    // certificate failures with Supabase's self-signed pooler certs. We strip
    // sslmode from the URL and control TLS exclusively via the explicit ssl option.
    // In production, replace rejectUnauthorized: false with true + supply a CA cert.
    const urlWithoutSslMode = new URL(env.DATABASE_URL);
    urlWithoutSslMode.searchParams.delete('sslmode');
    const pool = new Pool({
      connectionString: urlWithoutSslMode.toString(),
      ssl: {
        rejectUnauthorized: false,
      },
      // Hardening pod pooler Supabase (Supavisor), który recyklinguje bezczynne
      // połączenia po stronie serwera → Postgres 57P01 "terminating connection
      // due to administrator command". Bez tego stare/zerwane połączenie potrafi
      // trafić z puli do requestu i wysypać zapytanie (np. GET /conversations).
      keepAlive: true, // TCP keep-alive: szybciej wykrywa zerwane połączenia
      maxUses: 7_500, // rotuj połączenie po N zapytań, żeby nie zwietrzało
      connectionTimeoutMillis: 10_000,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    // pg emituje 'error' na puli, gdy serwer ubije BEZCZYNNE połączenie. Bez tego
    // handlera taki błąd staje się nieobsłużony i leci do Sentry jako szum, a to
    // transient, który sam się goi (pula otwiera świeże połączenie przy kolejnym
    // zapytaniu). Logujemy jako warn i nie propagujemy. (Handler po super(), bo
    // przed nim nie wolno użyć this w konstruktorze klasy pochodnej.)
    pool.on('error', (err) => {
      this.logger.warn(
        `Bezczynne połączenie z bazą zerwane przez serwer (transient): ${err.message}`,
      );
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
