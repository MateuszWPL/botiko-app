'use client';

const STORAGE_KEY = 'botiko_onboarding_v1';

export interface OnboardingData {
  industry: string;
  companyName: string;
  address: string;
  phone: string;
  hours: string;
  services: string;
  botName: string;
  primaryColor: string;
  welcomeMsg: string;
  botId?: string;
}

const DEFAULTS: OnboardingData = {
  industry: 'BEAUTY',
  companyName: '',
  address: '',
  phone: '',
  hours: '',
  services: '',
  botName: 'Asystentka',
  primaryColor: '#6366F1',
  welcomeMsg: 'Dzień dobry! W czym mogę pomóc?',
};

export function loadOnboarding(): OnboardingData {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<OnboardingData>) };
  } catch {
    return DEFAULTS;
  }
}

export function saveOnboarding(data: Partial<OnboardingData>): void {
  if (typeof window === 'undefined') return;
  const current = loadOnboarding();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
}

export function clearOnboarding(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
