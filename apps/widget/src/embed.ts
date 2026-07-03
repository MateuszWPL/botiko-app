import { h, render } from 'preact';
import { isAdminPath, onPrimary } from './widget-utils';
import { useState, useEffect } from 'preact/hooks';
import { Launcher } from './Launcher';
import { ChatWindow } from './ChatWindow';

interface BotConfig {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  online: boolean;
  companyPhone: string | null;
  companyAddress: string | null;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  suggestedQuestions: string[];
  avatarEmoji: string;
  // Server-computed: whether this Origin may embed the bot. The API no longer
  // exposes the raw domain list (avoids leaking the tenant's domains).
  domainAllowed: boolean;
}

function Widget({
  botId,
  config,
  apiUrl,
}: {
  botId: string;
  config: BotConfig;
  apiUrl: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Expose global API so the host page can open/close/toggle the widget programmatically.
  useEffect(() => {
    (window as unknown as Record<string, unknown>)['BotikoWidget'] = {
      open:   () => setIsOpen(true),
      close:  () => setIsOpen(false),
      toggle: () => setIsOpen((prev: boolean) => !prev),
    };
    return () => {
      delete (window as unknown as Record<string, unknown>)['BotikoWidget'];
    };
  }, []);

  return h('div', { id: 'botiko-widget-root' }, [
    h(ChatWindow, {
      botId,
      botName: config.name,
      primaryColor: config.primaryColor,
      welcomeMessage: config.welcomeMsg,
      isOpen,
      apiUrl,
      onClose: () => setIsOpen(false),
      online: config.online,
      companyPhone: config.companyPhone,
      companyAddress: config.companyAddress,
      offlineMessage: config.offlineMessage,
      businessHoursStart: config.businessHoursStart,
      businessHoursEnd: config.businessHoursEnd,
      businessDays: config.businessDays,
      suggestedQuestions: config.suggestedQuestions,
      avatarEmoji: config.avatarEmoji,
    }),
    h(Launcher, {
      primaryColor: config.primaryColor,
      isOpen,
      welcomeMsg: config.welcomeMsg,
      onClick: () => setIsOpen((prev) => !prev),
    }),
  ]);
}

async function init() {
  // Skip known CMS admin panels — widget has no business appearing in /wp-admin etc.
  if (isAdminPath(window.location.pathname)) return;

  // Guard against double-init — synchronous flag na documentElement ustawiony PRZED
  // async init, odporny na race condition gdy dwa skrypty ładują się równolegle.
  // getElementById jest async i może przepuścić dwa równoległe init().
  if (document.documentElement.hasAttribute('data-botiko-init')) {
    return;
  }
  document.documentElement.setAttribute('data-botiko-init', 'true');

  // Dodatkowy guard: jeśli host już istnieje (np. nawigacja SPA), wyjdź
  if (document.getElementById('botiko-host')) {
    return;
  }

  // document.currentScript is null when loaded via GTM, async, or defer.
  // Fall back to querySelector so the widget works on WordPress + GTM setups.
  const scriptEl =
    (document.currentScript as HTMLScriptElement | null) ??
    (document.querySelector('script[data-bot-id]') as HTMLScriptElement | null);
  const botId = scriptEl?.getAttribute('data-bot-id');

  if (!botId) {
    console.error('[Botiko] Missing data-bot-id attribute on script tag');
    return;
  }

  // API URL is fixed at build time — no runtime override to prevent PII exfiltration
  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://api.botiko.pl';

  let config: BotConfig = {
    id: botId,
    name: 'Botiko',
    welcomeMsg: 'Dzień dobry! W czym mogę pomóc?',
    primaryColor: '#6366F1',
    online: true,
    companyPhone: null,
    companyAddress: null,
    offlineMessage: null,
    businessHoursStart: null,
    businessHoursEnd: null,
    businessDays: [],
    suggestedQuestions: ['Czym możesz mi pomóc?', 'Jakie są godziny pracy?', 'Jak się skontaktować?'],
    avatarEmoji: '',
    domainAllowed: true,
  };

  try {
    const res = await fetch(`${apiUrl}/api/v1/bot/${botId}/config`);
    if (res.ok) {
      config = (await res.json()) as BotConfig;
    }
  } catch {
    // use defaults — bot still works without remote config
  }

  // The API computes domainAllowed from the Origin header. When this Origin
  // isn't whitelisted → show offline. Security is still enforced server-side;
  // this is UX-only (no chat prompt, red dot).
  if (!config.domainAllowed) {
    config.online = false;
  }

  // Shadow DOM — isolates widget CSS from host page
  const host = document.createElement('div');
  host.id = 'botiko-host';
  // Expose --botiko-primary on the host element so the page owner can override:
  // #botiko-host { --botiko-primary: #ff0000; }
  host.style.setProperty('--botiko-primary', config.primaryColor);
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'closed' });

  // Inject CSS variables into shadow root so components can use var(--botiko-primary)
  const styleEl = document.createElement('style');
  // Sanitize to hex color only — prevents CSS injection through the primaryColor value
  const safeColor = config.primaryColor.replace(/[^#0-9a-fA-F]/g, '');
  // Contrast-aware foreground for text/icons on the primary background — keeps
  // the widget readable even when the tenant picks a light accent colour.
  const onPrimaryColor = onPrimary(safeColor);
  styleEl.textContent = `:host { --botiko-primary: ${safeColor}; --botiko-on-primary: ${onPrimaryColor}; }`;
  shadow.appendChild(styleEl);

  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  render(h(Widget, { botId, config, apiUrl }), mountPoint);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void init());
} else {
  void init();
}
