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
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
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
