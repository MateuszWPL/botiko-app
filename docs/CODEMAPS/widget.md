# Widget Codemap. Preact + Vite

**Last Updated:** 2026-04-18  
**Location:** `apps/widget/`  
**Entry Point:** `apps/widget/src/index.ts`  
**Port:** 5173 (dev), CDN (prod)  
**Hard Limit:** <12KB gzip (enforced by Vite plugin)

---

## Quick Overview

Standalone embed script for customer websites. Uses Preact (not React) to stay under 12KB gzip budget. Loaded via:

```html
<script src="https://botiko.pl/embed.js" data-bot-id="uuid"></script>
```

The script:
1. Detects bot ID from `data-bot-id` attribute or via GTM
2. Creates Shadow DOM for style isolation
3. Renders chat widget (button + modal)
4. Communicates with API via HTTP
5. Stores session in `sessionStorage` (privacy: cleared on tab close)
6. Handles errors gracefully (fallback UI, offline mode)

---

## Directory Structure

```
apps/widget/
├── src/
│   ├── index.ts                     # Entry point, window setup, initialization
│   │
│   ├── components/
│   │   ├── Widget.tsx               # Main widget component (Preact)
│   │   ├── ChatWindow.tsx           # Chat modal (message list, input)
│   │   ├── MessageBubble.tsx        # Individual message (user/bot)
│   │   ├── LeadForm.tsx             # Lead capture form (shows on escalation)
│   │   ├── Button.tsx               # Toggle button (minimized state)
│   │   ├── Input.tsx                # Message input field
│   │   └── Spinner.tsx              # Loading indicator
│   │
│   ├── hooks/
│   │   ├── useChat.ts               # Chat state management (messages, loading)
│   │   ├── useSession.ts            # Session persistence (sessionStorage)
│   │   ├── useApi.ts                # API client for chat endpoint
│   │   └── useBotConfig.ts          # Fetch bot config (colors, questions, etc)
│   │
│   ├── services/
│   │   ├── api.ts                   # HTTP client (fetch wrapper)
│   │   ├── storage.ts               # sessionStorage helpers
│   │   ├── sanitizer.ts             # Basic client-side sanitization
│   │   └── timer.ts                 # Timeout & abort controller
│   │
│   ├── styles/
│   │   └── widget.css               # Scoped styles (inside Shadow DOM)
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript types (shared with API)
│   │
│   ├── utils/
│   │   ├── dom.ts                   # DOM utilities (find script, query)
│   │   ├── dom.ts                   # DOM utilities (find script, query)
│   │   ├── colors.ts                # Brand color helpers
│   │   └── logger.ts                # Debug logging (dev mode)
│   │
│   └── constants.ts                 # API URL, timeouts, limits
│
├── index.html                        # Dev entry point
├── vite.config.ts                   # Vite config with size check
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind (if using)
└── package.json                     # Dependencies (Preact, Vite)
```

---

## Core Flow

### Initialization (index.ts)

```typescript
// On page load:
// 1. Find bot ID from <script data-bot-id="..."> or fallback to window.botikoConfig
// 2. Create Shadow DOM container
// 3. Render Widget component into Shadow DOM
// 4. Setup event listeners (toggle button, message send)
// 5. Fetch bot config (colors, suggested questions, etc)
// 6. Restore session from sessionStorage (if any)
```

### Chat Flow

```
1. User types message → presses Enter
2. Hook: useChat captures message, adds to local state
3. API call: POST /api/v1/chat { botId, message, sessionId, conversationId }
4. Response: bot message, suggested questions, action (rag | no-rag | escalation)
5. Hook: useChat updates messages list, shows suggested questions
6. sessionStorage: persist conversation (botiko_{botId} key)
7. UI: scroll to latest message, clear input
```

### Lead Capture

When chat escalates (user asks for human, or limit reached):
```
1. Show LeadForm (hidden until needed)
2. User enters: firstName, phone (optional: email)
3. POST /api/v1/leads { firstName, phone, botId, email }
4. Response: success message
5. UI: close lead form, show thank you
```

---

## Key Components

### Widget.tsx

Main Preact component:

```typescript
export function Widget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, loading } = useChat();
  const { config, loading: configLoading } = useBotConfig();
  
  return (
    <div class="botiko-widget">
      <Button 
        color={config?.primaryColor}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <ChatWindow 
          messages={messages}
          loading={loading}
          config={config}
          onSendMessage={/* ... */}
        />
      )}
    </div>
  );
}
```

### ChatWindow.tsx

Message list + input:

```typescript
export function ChatWindow({ messages, loading, onSendMessage }) {
  return (
    <div class="chat-window">
      <div class="messages-container">
        {messages.map(msg => (
          <MessageBubble 
            key={msg.id}
            role={msg.role}
            content={msg.content}
          />
        ))}
        {loading && <Spinner />}
      </div>
      
      <Input 
        placeholder="Type a message..."
        onSend={onSendMessage}
      />
    </div>
  );
}
```

### MessageBubble.tsx

Individual message (user or bot):

```typescript
export function MessageBubble({ role, content }) {
  return (
    <div class={role === 'user' ? 'msg-user' : 'msg-bot'}>
      {role === 'bot' && <div class="avatar">Bot</div>}
      <div class="content">
        {/* Safely render HTML (sanitized by backend) */}
        {content}
      </div>
    </div>
  );
}
```

### LeadForm.tsx

Lead capture (shows on escalation):

```typescript
export function LeadForm({ botId, onSubmit }) {
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.createLead({ firstName, phone, botId });
    onSubmit({ firstName, phone });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        placeholder="Your name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <Input 
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button type="submit">Send Lead</Button>
    </form>
  );
}
```

---

## Hooks

### useChat()

State management for messages:

```typescript
export function useChat(botId) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const sendMessage = async (text) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.chat({
        botId,
        message: text,
        sessionId: getSessionId(),
      });
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content: text },
        { role: 'bot', content: response.botMessage },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { messages, loading, error, sendMessage };
}
```

### useSession()

Session persistence:

```typescript
export function useSession(botId) {
  const key = `botiko_${botId}`;
  
  const save = (data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
  };
  
  const load = () => {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
  
  const clear = () => {
    sessionStorage.removeItem(key);
  };
  
  return { save, load, clear };
}
```

### useBotConfig()

Fetch bot configuration:

```typescript
export function useBotConfig(botId) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.getBotConfig(botId)
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [botId]);
  
  return { config, loading };
}
```

---

## Services

### api.ts

HTTP client:

```typescript
const API_URL = 'https://api.botiko.pl/api/v1';

export const api = {
  chat: async (data) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response.json();
    } finally {
      clearTimeout(timeout);
    }
  },
  
  getBotConfig: (botId) => {
    return fetch(`${API_URL}/bot/${botId}/config`).then(r => r.json());
  },
  
  createLead: (data) => {
    return fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },
};
```

### storage.ts

Session persistence:

```typescript
export const storage = {
  getConversation: (botId) => {
    const key = `botiko_${botId}`;
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  saveConversation: (botId, conversation) => {
    const key = `botiko_${botId}`;
    sessionStorage.setItem(key, JSON.stringify(conversation));
  },
  
  clearConversation: (botId) => {
    const key = `botiko_${botId}`;
    sessionStorage.removeItem(key);
  },
};
```

---

## Styling Strategy

### Shadow DOM Isolation

Widget renders inside a Shadow DOM to prevent host page styles from leaking in:

```typescript
// In index.ts
const shadowHost = document.createElement('div');
const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

// All styles are scoped to Shadow DOM
const style = document.createElement('style');
style.textContent = /* CSS from widget.css */;
shadowRoot.appendChild(style);

// Render Preact into Shadow DOM
render(<Widget />, shadowRoot);
```

### Styles (widget.css)

Scoped CSS (Shadow DOM isolates it):

```css
.botiko-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}

.chat-window {
  width: 400px;
  height: 600px;
  border-radius: 12px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  background: white;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg-user {
  align-self: flex-end;
  background: #6366F1;
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
}

.msg-bot {
  align-self: flex-start;
  background: #F1F5F9;
  color: #0F172A;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
}
```

---

## Bundle Size Management

### Hard Limit: <12KB gzip

Enforced in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'embed.js',
      },
    },
  },
  
  // Size check plugin
  esbuild: {
    drop: ['console', 'debugger'], // Remove console.log
  },
});

// Post-build size check
import { readFileSync } from 'fs';
import { gzipSync } from 'zlib';

const built = readFileSync('dist/embed.js', 'utf-8');
const gzipped = gzipSync(built);
const kbSize = (gzipped.length / 1024).toFixed(2);

if (gzipped.length > 12 * 1024) {
  throw new Error(`Bundle too large: ${kbSize}KB (limit: 12KB)`);
}

console.log(`✅ Widget: ${kbSize}KB (limit: 12KB)`);
```

### Size Optimization Tips

1. **Use Preact** (not React): ~8KB smaller
2. **Tree-shake**: Remove unused code
3. **No external deps**: All logic self-contained
4. **Minify everything**: Vite handles this
5. **Remove console logs**: esbuild drop option
6. **Code split carefully**: Avoid lazy loading

Current breakdown:
- Preact: ~3KB
- Widget components: ~4KB
- API client: ~1KB
- Utilities: ~2KB
- Styles: ~1KB
- **Total: ~11KB** (safe margin below 12KB limit)

---

## Error Handling

### Network Errors

```typescript
try {
  const response = await api.chat(data);
} catch (error) {
  if (error.name === 'AbortError') {
    // Timeout (30s exceeded)
    showMessage('Sorry, the connection timed out. Please try again.');
  } else if (error.message.includes('HTTP 429')) {
    // Rate limited
    showMessage('Too many messages. Please wait a moment.');
  } else if (error.message.includes('HTTP 403')) {
    // Plan limit reached
    showLeadForm('Your plan limit reached. Send us a message!');
  } else if (error.message.includes('HTTP 5')) {
    // Server error
    showMessage('Server error. Please try again later.');
  } else {
    // Generic error
    showMessage('Error: ' + error.message);
  }
}
```

### Offline Mode

If request fails:
1. Show message: "We're having trouble connecting. Your message may not have been sent."
2. Offer retry button
3. Suggest email contact if persistent

---

## GTM Compatibility

Widget must work when injected via Google Tag Manager:

```html
<!-- GTM Script: -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://botiko.pl/embed.js';
    script.setAttribute('data-bot-id', 'abc123');
    document.body.appendChild(script);
  })();
</script>
```

**Key:** Use `document.currentScript` fallback:

```typescript
// Find our script tag
const script = document.currentScript || 
               document.querySelector('script[data-bot-id]');

const botId = script?.getAttribute('data-bot-id');
```

---

## Double-Init Prevention

Prevent issues if script is loaded twice:

```typescript
// In index.ts
if (window.BotikoWidget) {
  console.warn('Botiko Widget already loaded');
  return;
}

window.BotikoWidget = {
  open: () => { /* ... */ },
  close: () => { /* ... */ },
  toggle: () => { /* ... */ },
};
```

---

## Global API (window.BotikoWidget)

Host page can control widget:

```html
<!-- Host page can call: -->
<script>
  BotikoWidget.open();       // Open chat
  BotikoWidget.close();      // Close chat
  BotikoWidget.toggle();     // Toggle
</script>
```

---

## Development & Testing

### Local Dev

```bash
cd apps/widget
pnpm install
pnpm dev                    # Vite server (http://localhost:5173)
```

Visit `index.html` (includes test page with widget loaded).

### Build & Size Check

```bash
pnpm build                  # Compiles to dist/embed.js
# Output: ✅ Widget: 10.45KB (limit: 12KB)
```

### Preview Built Bundle

```bash
pnpm preview                # Serve dist/ locally
```

### Debug in Browser

1. Open DevTools Console
2. Type: `window.BotikoWidget` (check it exists)
3. Type: `window.BotikoWidget.open()` (opens chat)
4. Network tab: see POST `/api/v1/chat` requests

---

## Deployment

1. **Build:** `pnpm build` → `dist/embed.js`
2. **Upload to CDN:** Vercel (automatic with GitHub Actions)
3. **URL:** `https://botiko.pl/embed.js` (CloudFront or similar)
4. **Header:** `Cache-Control: public, max-age=3600` (1 hour)

---

## Supported Platforms

**Primary: WordPress**: installed via WPCode plugin (free, 2M+ installs). Instructions in `apps/web/app/dashboard/embed/EmbedCode.tsx`. WordPress = ~93% of Polish CMS market, primary target platform.

**Universal fallback: Generic HTML**: direct `<script>` tag before `</body>` on any site.

Other CMS (Shopify, Webflow, Squarespace, Wix, GTM), the script works technically but are not officially supported and have no per-platform instructions in the dashboard. Removed from MVP scope.

---

## Related Codemaps

- [Backend API](./backend.md)
- [Frontend Web](./frontend.md)
- [Database Schema](./database.md)
- [Integrations](./integrations.md)

---

**Last Updated:** 2026-04-18
