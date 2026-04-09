import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import { Launcher } from './Launcher';
import { ChatWindow } from './ChatWindow';

interface BotConfig {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
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

  return h('div', { id: 'botiko-widget-root' }, [
    h(ChatWindow, {
      botId,
      botName: config.name,
      primaryColor: config.primaryColor,
      welcomeMessage: config.welcomeMsg,
      isOpen,
      apiUrl,
    }),
    h(Launcher, {
      primaryColor: config.primaryColor,
      isOpen,
      onClick: () => setIsOpen((prev) => !prev),
    }),
  ]);
}

async function init() {
  const scriptEl = document.currentScript as HTMLScriptElement | null;
  const botId = scriptEl?.getAttribute('data-bot-id');

  if (!botId) {
    console.error('[Botiko] Missing data-bot-id attribute on script tag');
    return;
  }

  const apiUrl =
    scriptEl?.getAttribute('data-api-url') ||
    (window as unknown as Record<string, string>).__BOTIKO_API_URL__ ||
    'https://api.botiko.pl';

  let config: BotConfig = {
    id: botId,
    name: 'Asystentka',
    welcomeMsg: 'Dzień dobry! W czym mogę pomóc?',
    primaryColor: '#6366F1',
  };

  try {
    const res = await fetch(`${apiUrl}/api/v1/bot/${botId}/config`);
    if (res.ok) {
      config = (await res.json()) as BotConfig;
    }
  } catch {
    // use defaults — bot still works without remote config
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
  styleEl.textContent = `:host { --botiko-primary: ${CSS.escape ? config.primaryColor.replace(/[^#0-9a-fA-F]/g, '') : config.primaryColor}; }`;
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
