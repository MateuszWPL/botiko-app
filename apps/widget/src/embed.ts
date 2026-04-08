import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import { Launcher } from './Launcher';
import { ChatWindow } from './ChatWindow';

interface BotConfig {
  name: string;
  welcomeMsg: string;
  primaryColor: string;
}

function Widget({
  botId,
  config,
}: {
  botId: string;
  config: BotConfig;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return h('div', { id: 'botiko-widget-root' }, [
    h(ChatWindow, {
      botId,
      primaryColor: config.primaryColor,
      welcomeMessage: config.welcomeMsg,
      isOpen,
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
    (window as unknown as Record<string, string>).__BOTIKO_API_URL__ ||
    'https://api.botiko.pl';

  let config: BotConfig = {
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
    // use defaults
  }

  const container = document.createElement('div');
  container.id = 'botiko-container';
  document.body.appendChild(container);

  render(h(Widget, { botId, config }), container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void init());
} else {
  void init();
}
