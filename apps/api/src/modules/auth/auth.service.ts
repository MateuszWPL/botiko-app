import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../../prisma/prisma.service';
import { env } from '../../config/env';
import { EmailService, emailToFirstName } from '../../email/email.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        // Skip email confirmation — trial + Stripe card capture is the real
        // verification step; adding a confirm-email click only adds friction.
        email_confirm: true,
      });

    if (authError || !authData.user) {
      const errorMsg = authError?.message?.toLowerCase() ?? '';
      // Supabase returns various messages for duplicate emails
      if (
        errorMsg.includes('already registered') ||
        errorMsg.includes('already exists') ||
        errorMsg.includes('duplicate') ||
        errorMsg.includes('email address has already been registered')
      ) {
        throw new ConflictException('Użytkownik z tym emailem już istnieje');
      }
      this.logger.error('Supabase user creation failed', authError?.message);
      throw new InternalServerErrorException('Rejestracja nie powiodła się');
    }

    const supabaseUserId = authData.user.id;

    try {
      // websiteUrl arrives normalized as `https://<host>` from the DTO (or
      // undefined when the user registers without a site). Use the bare
      // hostname as the initial tenant.name, falling back to the email's local
      // part; the user can rename anytime in Ustawienia.
      const initialName = dto.websiteUrl
        ? new URL(dto.websiteUrl).hostname.replace(/^www\./, '')
        : dto.email.split('@')[0];

      const tenant = await this.prisma.$transaction(async (tx) => {
        const newTenant = await tx.tenant.create({
          data: {
            name: initialName,
            websiteUrl: dto.websiteUrl ?? null,
            industry: dto.industry,
            plan: 'STARTER',
            isActive: true,
            trialEndsAt: new Date(Date.now() + 14 * 86_400_000),
          },
        });

        await tx.user.create({
          data: {
            email: dto.email,
            tenantId: newTenant.id,
            role: 'OWNER',
          },
        });

        return newTenant;
      });

      const { error: metaError } =
        await this.supabase.auth.admin.updateUserById(supabaseUserId, {
          user_metadata: { tenant_id: tenant.id },
        });

      if (metaError) {
        this.logger.error(
          'Failed to set tenant_id in user metadata',
          metaError.message,
        );
      }

      this.logger.log(`New tenant registered: ${tenant.id}`);

      // Look up the DB user id we just created for EmailLog idempotency
      const dbUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });
      if (dbUser) {
        // Fire-and-forget — registration must not fail because of email
        void this.emailService
          .sendWelcome({
            userId: dbUser.id,
            email: dto.email,
            firstName: emailToFirstName(dto.email),
          })
          .catch((err: unknown) => {
            this.logger.error('Failed to send welcome email', err);
          });
      }

      return { message: 'Account created successfully.' };
    } catch (error) {
      // Rollback Supabase user if Prisma transaction failed
      await this.supabase.auth.admin
        .deleteUser(supabaseUserId)
        .catch((e: unknown) => {
          this.logger.error(
            'Failed to cleanup Supabase user after registration error',
            e,
          );
        });
      this.logger.error('Registration transaction failed', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      // Never reveal whether email exists — always generic message
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }

  async logout(accessToken: string): Promise<void> {
    const { error } = await this.supabase.auth.admin.signOut(
      accessToken,
      'local',
    );
    if (error) {
      // Non-critical — client should discard tokens regardless
      this.logger.warn('Supabase signout warning', error.message);
    }
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }
}
