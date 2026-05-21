const TRIAL_DAYS = 14;

/**
 * Effective trial end date. Uses the explicit `trialEndsAt` column; falls
 * back to `createdAt + 14 days` only for legacy rows where it is still null.
 */
export function trialEndDate(t: {
  createdAt: Date;
  trialEndsAt: Date | null;
}): Date {
  return (
    t.trialEndsAt ?? new Date(t.createdAt.getTime() + TRIAL_DAYS * 86_400_000)
  );
}

export function isTenantOnline(t: {
  isActive: boolean;
  createdAt: Date;
  trialEndsAt: Date | null;
  stripeSubscriptionId: string | null;
}): boolean {
  if (!t.isActive) return false;
  if (!t.stripeSubscriptionId) {
    if (trialEndDate(t).getTime() <= Date.now()) return false;
  }
  return true;
}
