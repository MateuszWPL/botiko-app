# Botiko. Widget (Preact + Vite)

Embeddable chat widget for customer websites. Features:
- 💬 Chat interface with AI responses
- 📱 Mobile-responsive
- 🔒 Shadow DOM isolation (no style conflicts)
- 📦 Ultra-lightweight (<12KB gzip)
- 🌐 Works on any website (WordPress, Shopify, Webflow, etc.)
- 📊 Session tracking (sessionStorage)

---

## Installation

### For Developers

```bash
pnpm install
pnpm dev                    # Dev server (http://localhost:5173)
pnpm build                  # Build dist/embed.js (enforces <12KB)
pnpm preview               # Preview built version
```

### For End Users (Website Owners)

Embed script on your website:

```html
<script src="https://botiko.pl/embed.js" data-bot-id="your-bot-uuid"></script>
```

That's it! Widget loads, creates Shadow DOM, renders chat interface.

---

## Local Development

### Dev Server

```bash
pnpm dev                    # Starts Vite at http://localhost:5173
```

Visit `index.html` (includes test page with widget loaded).

### Build & Size Check

```bash
pnpm build                  # Compiles to dist/embed.js
# Output:
# ✅ Widget: 10.45KB (limit: 12KB)
```

Build **fails** if bundle exceeds 12KB gzip (hard limit enforced by Vite plugin).

### Debug in Browser

1. Open browser DevTools (F12)
2. Console tab: type `window.BotikoWidget` (should exist)
3. Call `BotikoWidget.open()` to open chat
4. Network tab: watch POST requests to `/api/v1/chat`

---

## Architecture

### Directory Structure

```
src/
├── index.ts                     # Entry point, window setup, init
│
├── components/
│   ├── Widget.tsx               # Main Preact component
│   ├── ChatWindow.tsx           # Message list + input
│   ├── MessageBubble.tsx        # Individual message
│   ├── LeadForm.tsx             # Lead capture
│   ├── Button.tsx               # Toggle button
│   ├── Input.tsx                # Message input
│   └── Spinner.tsx              # Loading indicator
│
├── hooks/
│   ├── useChat.ts               # Message state management
│   ├── useSession.ts            # sessionStorage persistence
│   ├── useApi.ts                # HTTP client
│   └── useBotConfig.ts          # Fetch bot config
│
├── services/
│   ├── api.ts                   # Fetch wrapper
│   ├── storage.ts               # sessionStorage helpers
│   ├── sanitizer.ts             # Input sanitization
│   └── timer.ts                 # Timeout management
│
├── styles/
│   └── widget.css               # Scoped styles (Shadow DOM)
│
├── types/
│   └── index.ts                 # TypeScript types
│
├── utils/
│   ├── dom.ts                   # DOM utilities
│   ├── colors.ts                # Brand colors
│   └── logger.ts                # Debug logging
│
├── constants.ts                 # API URL, timeouts, limits
└── index.html                  # Test page (for dev)
```

---

## Stack

- **Framework:** Preact (not React: 10KB smaller)
- **Build Tool:** Vite
- **Styling:** CSS-in-JS + Shadow DOM (isolated)
- **TypeScript:** Strict mode
- **Size Limit:** <12KB gzip (enforced)

---

## Key Concepts

### Shadow DOM Isolation

Widget renders inside Shadow DOM to prevent host page styles from affecting it:

```typescript
// Shadow DOM prevents style leakage
const shadowRoot = hostElement.attachShadow({ mode: 'open' });
render(<Widget />, shadowRoot);
// CSS inside Shadow DOM is scoped, doesn't affect host page
```

### Session Persistence

Chat history stored in `sessionStorage` (not `localStorage`):

```typescript
// Clears when user closes the tab (privacy by design)
const key = `botiko_${botId}`;
const conversation = JSON.parse(sessionStorage.getItem(key));
```

### API Integration

All requests go to NestJS backend:

```typescript
// POST /api/v1/chat
await fetch('https://api.botiko.pl/api/v1/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ botId, message, sessionId }),
  signal: AbortController.signal,  // 30s timeout
});
```

### Error Handling

Graceful degradation for network issues:

```typescript
try {
  response = await api.chat(data);
} catch (error) {
  if (error.name === 'AbortError') {
    showMessage('Connection timed out');
  } else if (error.status === 429) {
    showMessage('Too many requests, please wait');
  } else {
    showMessage('Network error, please try again');
  }
}
```

---

## Bundle Size Management

### Hard Limit: <12KB gzip

Enforced by Vite plugin in `vite.config.ts`:

```typescript
// Fails build if size exceeds 12KB gzip
const gzipped = gzipSync(built);
if (gzipped.length > 12 * 1024) {
  throw new Error(`Bundle too large: ${(gzipped.length / 1024).toFixed(2)}KB`);
}
```

### Size Breakdown

- Preact core: ~3KB
- Widget components: ~4KB
- API client: ~1KB
- Utilities + styles: ~2KB
- **Total: ~10KB** (safe margin)

### Optimization Tips

1. **Use Preact** (not React)
2. **Tree-shake** unused code
3. **No external deps** (everything self-contained)
4. **Minify** (Vite does this)
5. **Remove console.log** (esbuild plugin)
6. **Code split carefully** (avoid lazy loading)

---

## Global API (window.BotikoWidget)

Host page can control widget:

```javascript
// Host page JavaScript

// Open chat
BotikoWidget.open();

// Close chat
BotikoWidget.close();

// Toggle open/close
BotikoWidget.toggle();

// Listen for events (future feature)
BotikoWidget.on('message', (msg) => {
  console.log('User said:', msg);
});
```

---

## Platform Compatibility

Tested on:
- ✅ WordPress
- ✅ Shopify
- ✅ Webflow
- ✅ Squarespace
- ✅ Wix (HTML Embed)
- ✅ GTM (Google Tag Manager)
- ✅ Generic HTML

### GTM Integration

Widget can be injected by GTM:

```html
<!-- GTM Custom Script -->
<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://botiko.pl/embed.js';
    script.setAttribute('data-bot-id', 'bot-uuid');
    document.body.appendChild(script);
  })();
</script>
```

---

## Script Tag Detection

Widget finds its own `<script>` tag:

```typescript
// Fallback chain for finding bot ID
const script = document.currentScript || 
               document.querySelector('script[data-bot-id]') ||
               document.querySelector('script[src*="botiko"]');

const botId = script?.getAttribute('data-bot-id');
```

Works with:
- Direct `<script>` tags
- GTM custom scripts
- Async/defer attributes
- Multiple scripts on page

---

## Double-Init Prevention

Prevents issues if script loaded twice:

```typescript
// Check if already initialized
if (window.BotikoWidget) {
  console.warn('Botiko Widget already loaded');
  return;
}

// Export global API
window.BotikoWidget = {
  open: () => { /* ... */ },
  close: () => { /* ... */ },
  toggle: () => { /* ... */ },
};
```

---

## Configuration

Bot configuration fetched from API:

```typescript
// GET /api/v1/bot/{botId}/config (public, no auth)
const config = {
  name: 'Salon Beauty Bot',
  welcomeMsg: 'Hello! How can I help?',
  primaryColor: '#6366F1',
  suggestedQuestions: ['What are your hours?'],
  businessHoursStart: 9,
  businessHoursEnd: 18,
  // ... more fields
};
```

Widget applies config:
- Brand color for buttons
- Welcome message on open
- Suggested questions
- Offline banner (if outside business hours)

---

## Styling & Customization

### Colors

Brand color applied to:
- Chat button background
- Sent message bubbles
- Interactive elements

Configured in bot settings dashboard.

### Responsive

Widget adapts to screen size:
- Desktop: 400px wide, 600px tall
- Mobile: ~95% viewport width/height
- Adjusts message layout for small screens

### CSS (Shadow DOM)

All styles scoped to Shadow DOM (no global conflicts):

```css
/* widget.css */
.botiko-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  /* ... */
}

.chat-window {
  width: 400px;
  height: 600px;
  /* ... */
}

.msg-user {
  background: #6366F1;
  color: white;
  /* ... */
}
```

---

## Testing

### Unit Tests

Not extensively implemented (MVP focus on E2E).

### Manual Testing

1. Start dev server: `pnpm dev`
2. Open `index.html` in browser
3. Test widget interactions:
   - Click button to open/close
   - Type messages
   - Test lead form capture
   - Check sessionStorage
4. Network tab: verify API calls

### Production Testing

1. Build: `pnpm build`
2. Upload `dist/embed.js` to CDN
3. Add `<script>` tag to test website
4. Verify widget appears and works

---

## Deployment

### Build

```bash
pnpm build              # Creates dist/embed.js
# Outputs: ✅ Widget: 10.45KB (limit: 12KB)
```

### CDN Upload

Option 1: Vercel (automatic)
```
GitHub push → GitHub Actions → Vercel auto-deploys → CDN
```

Option 2: Manual upload
```
scp dist/embed.js user@cdn.example.com:/var/www/botiko/
```

### Cache Headers

```
Cache-Control: public, max-age=3600
```

(1 hour TTL, balance between fresh code and cache efficiency)

---

## Performance

### Load Time

Widget is lazy-loaded (doesn't block page):

```html
<script src="https://botiko.pl/embed.js" async></script>
```

Page loads immediately, widget loads in background.

### Timeout Handling

Long requests abort after 30s (prevents hanging spinners):

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 30000);
fetch(url, { signal: controller.signal });
```

---

## Troubleshooting

### Widget Not Appearing

1. Check browser console for errors
2. Verify `data-bot-id` is valid UUID
3. Check CORS headers (should be open)
4. Verify bot is active in dashboard

### Chat Not Working

1. Check Network tab → POST /api/v1/chat requests
2. Verify API is running (http://localhost:3001)
3. Check bot domain whitelist (should include your domain)

### Bundle Size Too Large

1. Run `pnpm build` to see size
2. Check imports (remove unused deps)
3. Use dynamic imports sparingly
4. Profile with `webpack-bundle-analyzer` (or similar)

---

## Related Docs

- **Full Codemap:** `/docs/CODEMAPS/widget.md`
- **Backend API:** `/docs/CODEMAPS/backend.md`
- **Integrations:** `/docs/CODEMAPS/integrations.md`

---

**Last Updated:** 2026-04-18
