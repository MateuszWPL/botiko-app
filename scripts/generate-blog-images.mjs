/**
 * Automatyczne generowanie grafik blogowych przez Gemini Flash Image Generation API
 *
 * Użycie:
 *   1. Pobierz darmowy klucz API: https://aistudio.google.com → "Get API key"
 *   2. node scripts/generate-blog-images.mjs <TWÓJ_KLUCZ_API>
 *
 * Model: gemini-2.0-flash-preview-image-generation (darmowy w AI Studio free tier)
 * Grafiki trafiają do: apps/web/public/blog/
 * Każdy post dostaje: {slug}-hero.jpg, {slug}-1.jpg, {slug}-2.jpg
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error('Użycie: node scripts/generate-blog-images.mjs <GEMINI_API_KEY>');
  console.error('Klucz API (darmowy): https://aistudio.google.com → Get API key');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'apps', 'web', 'public', 'blog');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Styl globalny dołączany do każdego promptu
const STYLE = 'photorealistic, professional photography, shallow depth of field, clean modern aesthetic, no text overlays, no logos, no watermarks';
const STYLE_FLAT = 'flat design illustration, clean minimal style, pastel indigo and teal color palette, white background, no text, no logos';

// 90 promptów: [slug, featured, img1, img2]
const POSTS = [
  [
    '7-pytan-klientek-po-22-w-salonie-bialystok',
    `Young Polish woman lying on a sofa at night, warm lamp light, scrolling her phone with a slight smile, cozy apartment interior, relaxed evening atmosphere, ${STYLE}`,
    `Interior of a modern Polish beauty salon at night, empty styling chairs, soft neon glow from vanity mirrors, plants by the window, nobody inside, ${STYLE}`,
    `Close-up of a woman's hands holding a smartphone, typing a message on a chat interface, warm light from a bedside lamp, blurred cozy bedroom background, ${STYLE}`,
  ],
  [
    '90-dni-po-launchu-botiko-build-in-public',
    `Young Polish male entrepreneur in his mid-20s sitting at a minimal desk, laptop open, large window with city view, morning light, focused expression, modern home office, ${STYLE}`,
    `Overhead flat-lay of a developer's workspace: laptop, notebook with hand-drawn wireframes, coffee mug, sticky notes, clean wooden desk, natural light, ${STYLE}`,
    `Analytics dashboard on a laptop screen showing upward-trending graphs, soft focus on the screen, blurred modern office background, warm indoor lighting, ${STYLE}`,
  ],
  [
    'alergeny-restauracja-bot-bialystok',
    `Polish restaurant interior during busy dinner service, waiter carrying plates in background, customer at table checking their phone while looking at menu, warm ambient lighting, wooden furniture, modern bistro, ${STYLE}`,
    `Close-up of restaurant menu on a table next to a smartphone, candlelight and warm table lamp in background, elegant tableware, ${STYLE}`,
    `Chef in a modern Polish restaurant kitchen presenting a dish, focus on careful plating, stainless steel surfaces, intense focused expression, ${STYLE}`,
  ],
  [
    'automatyzacja-obslugi-klienta-gabinet-kosmetyczny',
    `Elegant Polish beauty treatment room, cosmetologist preparing tools on a tray, client relaxing on treatment bed, soft warm lighting, white and beige interior, minimalist and professional, ${STYLE}`,
    `Beauty salon receptionist at a front desk, looking at a computer screen with a calm smile, modern reception area with plants and mirrors in background, ${STYLE}`,
    `Customer service automation flow icons: phone, chat bubble, calendar, checkmark connected by clean arrows, pastel indigo and green color palette, ${STYLE_FLAT}`,
  ],
  [
    'baza-wiedzy',
    `Small business owner sitting at a clean desk, writing in a notebook with a laptop open showing a simple document editor, warm home office light, potted plant, focused and calm atmosphere, ${STYLE}`,
    `Structured knowledge base with folder icons, document pages, search bar and organized sections in indigo teal and white, clean grid layout, ${STYLE_FLAT}`,
    `Overhead shot of a desk with printed checklists, sticky notes with organized lists, coffee, a pen hovering over paper, warm morning light, wooden desk surface, ${STYLE}`,
  ],
  [
    'baza-wiedzy-rag-co-to-jest-dla-firmy',
    `Retrieval pipeline illustration: magnifying glass searching through layered document cards, arrows flowing into a response bubble, indigo and teal color scheme, modern SaaS visual style, ${STYLE_FLAT}`,
    `Close-up of a laptop screen showing a well-organized document library interface, soft blurred office background, warm indoor light, person's hands resting on keyboard, ${STYLE}`,
    `Data flow from multiple sources website PDF notes into a central hub with a search icon, minimalist icons, indigo green white palette, ${STYLE_FLAT}`,
  ],
  [
    'booksy-vs-bot',
    `Split composition illustration: left side booking calendar app icon, right side chat bubble interface icon, connected by a central arrow, indigo and emerald green, balanced composition, ${STYLE_FLAT}`,
    `Salon owner at a laptop reviewing two different screens side by side, thoughtful expression, modern beauty salon background with mirrors and plants, warm lighting, ${STYLE}`,
    `Polish woman client on her phone completing a booking at a salon, seated in a waiting area with modern decor, plants, soft lighting, relaxed atmosphere, ${STYLE}`,
  ],
  [
    'booksy-vs-chatbot-salon-bialystok',
    `Modern beauty salon reception in Poland, receptionist smiling at a client while another client checks their phone, warm afternoon light through large windows, plants and mirrors in background, ${STYLE}`,
    `Close-up of a smartphone showing a calendar booking confirmation, woman's manicured hand holding the phone, blurred beauty salon background, warm bokeh lighting, ${STYLE}`,
    `Two connected systems, a calendar icon and a chat bubble, joined by a dotted flow line and a checkmark, indigo and teal, minimal white background, ${STYLE_FLAT}`,
  ],
  [
    'bot-dla-gabinetu-zdrowia-bialystok',
    `Modern private health clinic waiting room in Poland, patient sitting calmly checking their phone, clean white and light wood interior, soft natural light, professional and welcoming atmosphere, ${STYLE}`,
    `Physiotherapist in a treatment room preparing a treatment bed, clean professional space, light blue walls, calm and organized environment, medical instruments neatly arranged, ${STYLE}`,
    `Patient's hands holding a smartphone, reading a message response, blurred clinical waiting room background, soft overhead lighting, ${STYLE}`,
  ],
  [
    'bot-dla-restauracji-bialystok',
    `Elegant Polish restaurant interior late evening, dim warm lighting, empty tables set with white tablecloths and candles, chef visible through kitchen window in background, atmospheric and inviting, ${STYLE}`,
    `Restaurant manager late at night reviewing reservation notifications on a tablet at an empty bar, warm bar lighting, bottles and glasses in background, focused expression, ${STYLE}`,
    `Person at home on a sofa at night sending a reservation inquiry on their phone, warm lamp light, cozy living room atmosphere, relaxed pose, ${STYLE}`,
  ],
  [
    'bot-dla-warsztatu-samochodowego-bialystok',
    `Polish automotive workshop interior, mechanic in work overalls leaning over a car engine, tools visible on a pegboard wall, professional garage lighting, authentic workshop atmosphere, ${STYLE}`,
    `Mechanic's hands covered in grease working on a car component, a smartphone lying nearby on a tool cart with screen lit up, garage background with cars, ${STYLE}`,
    `Workshop owner at a small front desk looking at a laptop screen, paperwork and car keys on the desk, waiting area visible behind, warm indoor lighting, ${STYLE}`,
  ],
  [
    'catering-komunia-bialystok-bot',
    `Elegant catering setup for a Polish communion celebration, long table with white tablecloth, flower decorations, beautifully arranged food platters, warm natural light through large windows, nobody at the table yet, ${STYLE}`,
    `Catering business owner at a desk reviewing inquiries on a laptop, order forms and event folders visible, home office, warm light, focused expression, ${STYLE}`,
    `Mother at home on her phone in the evening, browsing catering options, warm kitchen background, family atmosphere, relaxed and thoughtful expression, ${STYLE}`,
  ],
  [
    'chatbot-ai-salon-beauty-klientki-24-7',
    `Luxurious modern beauty salon interior, empty styling chairs with ring lights, vanity mirrors lit up, plants and fresh flowers, late evening atmosphere, warm and professional, ${STYLE}`,
    `Young woman at night in bed scrolling her phone, receiving a quick reply to a beauty salon inquiry, soft bedside lamp, cozy bedroom atmosphere, satisfied expression, ${STYLE}`,
    `Beauty salon owner reviewing client inquiry history on a laptop in the morning with a coffee, bright morning light, salon interior visible in the background, ${STYLE}`,
  ],
  [
    'chatbot-dla-restauracji-menu-alergeny-rezerwacja',
    `Cozy modern Polish restaurant interior, guest at a table browsing menu on their smartphone, warm ambient lighting, wooden furniture and hanging Edison bulbs, ${STYLE}`,
    `Close-up of a well-presented restaurant dish on a white plate, garnished with fresh herbs, elegant tableware, candlelight reflection, bokeh restaurant background, ${STYLE}`,
    `Conversation flow: menu card icon, allergen leaf icon, calendar reservation icon, connected by clean arrows, warm orange and indigo palette, ${STYLE_FLAT}`,
  ],
  [
    'chatbot-na-strone-www-mala-firma',
    `Small Polish service business owner at a laptop, looking at a website on screen with a chat widget open in the corner, modern small office or home office, warm light, ${STYLE}`,
    `Overhead view of a small business desk: laptop open to a website, notebook, coffee, business cards, clean wooden surface, natural light from window, ${STYLE}`,
    `Small business website layout with a chat bubble appearing in the bottom corner, cursor hovering over it, indigo and teal color scheme, ${STYLE_FLAT}`,
  ],
  [
    'chatbot-recepcja',
    `Modern service business reception area, empty front desk with a computer screen, stylish interior with plants and warm lighting, professional and welcoming, nobody behind the desk, ${STYLE}`,
    `Beauty salon front desk area with a laptop, appointment book, fresh flowers, and a phone, warm morning light, elegant and organized, ${STYLE}`,
    `24/7 service flow: clock icon, chat bubble icon, calendar icon, checkmark, pastel indigo and green palette, circular layout, ${STYLE_FLAT}`,
  ],
  [
    'chatbot-salon-kosmetyczny-bialystok',
    `Stylish modern beauty salon interior in Poland, hairstylist working on a client's hair, ring lights and mirrors, warm professional lighting, elegant and contemporary decor, ${STYLE}`,
    `Polish female salon owner sitting at a reception desk reviewing client messages on a smartphone, warm salon lighting, styling chairs and mirrors visible in background, ${STYLE}`,
    `Close-up of a woman's hands getting a manicure treatment, pastel nail colors, blurred modern salon background, warm light, ${STYLE}`,
  ],
  [
    'fizjoterapeuta-bialystok-bot-pierwsze-konsultacje',
    `Person lying on a couch at home late evening, holding a phone and typing a health inquiry message, warm lamp light, cozy apartment, slightly worried but hopeful expression, ${STYLE}`,
    `Modern physiotherapy clinic treatment room, massage table with fresh linen, anatomical models on shelf, clean and professional, soft natural light, nobody present, calm atmosphere, ${STYLE}`,
    `Physiotherapist at a desk in the morning checking appointment confirmations on a laptop, coffee nearby, treatment room in background, professional and calm atmosphere, ${STYLE}`,
  ],
  [
    'ile-kosztuje-naprawa-warsztat-bialystok',
    `Car mechanic in a clean Polish automotive workshop standing next to a vehicle on a lift, pointing at the underside of the car, professional posture, modern well-equipped garage, ${STYLE}`,
    `Pricing breakdown chart: car icon with service category icons for oil brakes tires connected to price range bars, indigo and slate gray palette, ${STYLE_FLAT}`,
    `Workshop front desk with an estimate form and car keys on the counter, customer's hand reaching for keys, mechanic visible in background, warm indoor lighting, ${STYLE}`,
  ],
  [
    'jak-zbierac-leady-ze-strony-internetowej-firma-uslugowa',
    `Small service business owner at a laptop reviewing new contact form submissions, notepad with names and phone numbers beside the laptop, warm home office light, focused and pleased expression, ${STYLE}`,
    `Lead capture funnel: website visitor icon, chat bubble, contact form, CRM card icon, indigo and emerald green, flowing arrow connectors, ${STYLE_FLAT}`,
    `Close-up of a smartphone showing a new contact notification pop-up, business person's hand holding the phone, blurred modern office background, warm light, ${STYLE}`,
  ],
  [
    'pillar-automatyzacja-obslugi',
    `Customer service automation landscape: interconnected icons for chat, calendar, notifications, analytics dashboard, customer profile, indigo teal green palette, large-scale hero composition, ${STYLE_FLAT}`,
    `Small business owner at a standing desk looking at a large monitor showing customer interaction overview, modern bright office space, plants in background, confident posture, ${STYLE}`,
    `2026 automation timeline: icons representing manual, semi-automated, fully automated stages, horizontal flow with milestone markers, indigo and slate palette, ${STYLE_FLAT}`,
  ],
  [
    'pytania-nocne',
    `Woman in pajamas sitting on a bed at night, holding a phone, soft bedside lamp casting warm orange glow, curious expression, cozy bedroom, ${STYLE}`,
    `Top-down view of a phone on a bed with a chat conversation open, cozy blanket visible, warm nighttime atmosphere, ${STYLE}`,
    `Modern beauty salon at night from outside, interior lights on, closed sign on door, warm glow through window, street reflection on wet pavement, atmospheric evening mood, ${STYLE}`,
  ],
  [
    'rodo-chatbot',
    `Data privacy shield with a chat bubble overlaid, surrounded by GDPR-related icons: lock, person, document, checkmark, indigo and teal palette, professional SaaS style, ${STYLE_FLAT}`,
    `Small business owner reading through a document carefully at a desk, laptop open beside them, pen in hand, thoughtful expression, warm home office light, ${STYLE}`,
    `Close-up of a privacy consent checkbox on a laptop screen, finger about to click, soft bokeh background of a modern office, ${STYLE}`,
  ],
  [
    'rodo-chatbot-gabinet-checklist',
    `Medical clinic administrative office, doctor or clinic manager reviewing compliance documents at a desk, laptop open, clean professional environment, warm indoor light, organized and trustworthy atmosphere, ${STYLE}`,
    `15-point compliance checklist: checkbox icons in a vertical list with shield and document motifs, indigo and teal color scheme, ${STYLE_FLAT}`,
    `Close-up of a healthcare professional's hands reviewing a printed document on a clipboard, blurred clinical interior in background, warm professional lighting, ${STYLE}`,
  ],
  [
    'rodo-chatbot-na-stronie-zgody-przetwarzanie-danych',
    `Service business website displayed on a laptop showing a chat window with a privacy consent banner, business owner sitting in background out of focus, warm office atmosphere, ${STYLE}`,
    `Person reading privacy consent notice on their phone before submitting a contact form, kitchen or living room setting, casual daytime atmosphere, ${STYLE}`,
    `Data consent flow: visitor icon, chat bubble, consent toggle, secured lock, database icon, clean horizontal arrows, indigo and green palette, ${STYLE_FLAT}`,
  ],
  [
    'roi-bota-ai-mala-firma-uslugowa',
    `ROI calculation illustration: investment coin icon on left, large arrow pointing right, multiple customer icons on right side, indigo and emerald green color palette, bold and clear composition, ${STYLE_FLAT}`,
    `Small business owner with a satisfied expression reviewing financial results on a laptop, coffee nearby, morning light through window, modern home office, ${STYLE}`,
    `Bar chart showing monthly revenue growth over 6 months, rising bars in indigo with accent green highlights, minimal grid, clean white background, ${STYLE_FLAT}`,
  ],
  [
    'schemat-chatbota-gabinet-fizjoterapii',
    `Knowledge base schema for a health clinic: icons for services, FAQ bubbles, pricing card, contact card organized in a clean grid, teal and indigo palette, ${STYLE_FLAT}`,
    `Physiotherapy clinic interior, treatment equipment neatly arranged, massage table with clean white pillow, natural light from window, calm and professional space, ${STYLE}`,
    `Physiotherapist at a small desk filling out a document template on a laptop, focused expression, clinic corridor visible through glass door, ${STYLE}`,
  ],
  [
    'schemat-chatbota-salon-beauty',
    `Beauty salon knowledge base: icons for services nails lashes hair, price list card, FAQ bubble, booking calendar organized in clean indigo pink white grid layout, ${STYLE_FLAT}`,
    `Beauty salon interior detail: organized shelf with professional cosmetics, towels, and tools, soft warm light, neat and aesthetic arrangement, ${STYLE}`,
    `Salon owner typing a service description on a laptop at a styling desk, mirrors and lights in background, focused and organized, warm professional atmosphere, ${STYLE}`,
  ],
  [
    'tidio-alternatywa-po-polsku',
    `Product comparison layout: four feature comparison cards in a 2x2 grid, indigo and slate color scheme, clean icons for chat pricing language support and integrations, balanced and clear, ${STYLE_FLAT}`,
    `Small Polish business owner at a laptop carefully comparing two browser tabs side by side, thoughtful expression, modern home office, warm afternoon light, ${STYLE}`,
    `Close-up of a laptop keyboard with a person's finger about to click, blurred comparison chart visible on screen in soft focus, warm bokeh background, ${STYLE}`,
  ],
  [
    'wymiana-opon-bialystok-bot-warsztat',
    `Busy Polish automotive workshop during tire change season, two mechanics working simultaneously on cars, tires stacked in background, bright professional workshop lighting, busy but organized atmosphere, ${STYLE}`,
    `Stack of car tires in a tidy workshop corner, mechanic in background working on a vehicle lift, authentic garage atmosphere, dramatic side lighting, ${STYLE}`,
    `Workshop owner at a front desk checking a long list of appointment requests on a tablet, busy expression but calm, workshop visible through open door, warm indoor lighting, ${STYLE}`,
  ],
];

// Hugging Face FLUX.1-schnell, darmowy, wysoka jakość
async function generateImage(prompt, outputPath) {
  const HF_TOKEN = API_KEY; // przekazuj token HF jako argument, lub 'anonymous'
  const url = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';

  const body = JSON.stringify({ inputs: prompt });
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'x-use-cache': 'false',
  };
  if (HF_TOKEN && HF_TOKEN !== 'anonymous' && HF_TOKEN !== 'dummy') {
    headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  }

  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method: 'POST', headers },
      (res) => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          if (res.statusCode === 503) {
            reject(new Error('503 Model loading, spróbuj ponownie za chwilę'));
            return;
          }
          if (res.statusCode !== 200) {
            const raw = Buffer.concat(chunks).toString('utf-8');
            let msg = `HTTP ${res.statusCode}`;
            try { msg += ': ' + (JSON.parse(raw)?.error ?? raw.slice(0, 200)); } catch {}
            reject(new Error(msg));
            return;
          }
          const buf = Buffer.concat(chunks);
          if (buf.length < 5000) {
            reject(new Error('Plik za mały, prawdopodobnie błąd API'));
            return;
          }
          fs.writeFileSync(outputPath, buf);
          resolve(outputPath);
        });
        res.on('error', reject);
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const DELAY_MS = 3000;
const RETRY_WAIT_MS = 30000;
const MAX_RETRIES = 3;

async function generateWithRetry(prompt, outputPath, filename, n, total) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await generateImage(prompt, outputPath);
      return true;
    } catch (err) {
      if (err.message.includes('429') && attempt < MAX_RETRIES) {
        console.log(`  429 [${n}/${total}] ${filename}, czekam 30s (próba ${attempt}/${MAX_RETRIES})`);
        await sleep(RETRY_WAIT_MS);
      } else {
        console.log(`  ERR [${n}/${total}] ${filename}: ${err.message}`);
        return false;
      }
    }
  }
  return false;
}

async function main() {
  const total = POSTS.length * 3;
  let done = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`\nGenerowanie ${total} grafik dla ${POSTS.length} postów (sekwencyjnie, retry na 429)...\n`);

  for (const [slug, featured, img1, img2] of POSTS) {
    const images = [
      { prompt: featured, filename: `${slug}-hero.jpg` },
      { prompt: img1,     filename: `${slug}-1.jpg`    },
      { prompt: img2,     filename: `${slug}-2.jpg`    },
    ];

    for (const { prompt, filename } of images) {
      const outputPath = path.join(OUTPUT_DIR, filename);
      done++;

      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 5000) {
        console.log(`  SKIP [${done}/${total}] ${filename}`);
        skipped++;
        continue;
      }

      process.stdout.write(`  --> [${done}/${total}] ${filename}... `);
      const ok = await generateWithRetry(prompt, outputPath, filename, done, total);
      if (ok) {
        console.log('OK');
      } else {
        failed++;
      }

      await sleep(DELAY_MS);
    }
  }

  console.log(`\nGotowe!`);
  console.log(`  Wygenerowane: ${done - skipped - failed}`);
  console.log(`  Pominięte:    ${skipped}`);
  console.log(`  Błędy:        ${failed}`);
  console.log(`\nGrafiki zapisane w: apps/web/public/blog/`);
  console.log(`\nNastępny krok, zaktualizuj image: w frontmatterze postów:`);
  console.log(`  node scripts/update-blog-image-paths.mjs`);
}

main().catch(console.error);
