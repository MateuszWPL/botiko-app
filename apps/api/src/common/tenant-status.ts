export function isTenantOnline(t: {
  isActive: boolean;
  createdAt: Date;
  stripeSubscriptionId: string | null;
}): boolean {
  if (!t.isActive) return false;
  if (!t.stripeSubscriptionId) {
    const trialEnd = new Date(t.createdAt);
    trialEnd.setDate(trialEnd.getDate() + 14);
    if (trialEnd.getTime() <= Date.now()) return false;
  }
  return true;
}
