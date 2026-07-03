/**
 * Message pre-processing pipeline.
 *
 * Every incoming chat message passes through this before hitting RAG or OpenAI.
 * Purpose: security (injection, scripts), UX (greetings, gibberish), cost (skip
 * unnecessary OpenAI calls for canned situations).
 *
 * Returns one of three actions:
 *  - 'proceed'  → sanitized text, run full RAG + AI pipeline
 *  - 'respond'  → skip AI entirely, return canned response immediately
 *  - 'no-rag'   → skip RAG but still call AI (greetings — let bot respond in-character)
 */

export type PreprocessResult =
  | { action: 'proceed'; text: string }
  | { action: 'respond'; response: string; showLeadForm?: boolean }
  | { action: 'no-rag'; text: string };

// ── Pattern banks ──────────────────────────────────────────────────────────────

/** HTML / script injection attempts */
const SCRIPT_PATTERNS: RegExp[] = [
  /<script\b/i,
  /<\/script>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /on(?:error|load|click|mouseover|focus|blur)\s*=/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /document\s*\.\s*cookie/i,
  /document\s*\.\s*write\s*\(/i,
  /window\s*\.\s*location/i,
  /eval\s*\(/i,
  /expression\s*\(/i, // CSS expression injection
];

/**
 * Prompt injection — attempts to override or reveal system instructions.
 * Word-boundary anchors reduce false positives on innocent sentences.
 */
const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions?/i,
  /disregard\s+(all\s+)?previous\s+instructions?/i,
  /forget\s+(everything|all|previous|instructions?)/i,
  /\bsystem\s+prompt\b/i,
  /reveal\s+(your\s+)?(prompt|instructions?|system)/i,
  /print\s+(your\s+)?(prompt|instructions?|system)/i,
  /show\s+(me\s+)?(your\s+)?(prompt|instructions?|system)/i,
  /what\s+(are\s+)?your\s+instructions/i,
  /you\s+are\s+now\s+(?!an?\s+assistant)/i, // "you are now [something else]"
  /act\s+as\s+(?!an?\s+assistant|a\s+helpful)/i, // "act as [not assistant]"
  /pretend\s+(to\s+be|you\s+are)/i,
  /roleplay\s+as/i,
  /jeste[sś]\s+teraz\s+(?!asystentem)/i, // "jesteś teraz [nie asystentem]"
  /zapomnij\s+(wszystko|instrukcje|poprzednie)/i,
  /ignoruj\s+(poprzednie\s+)?instrukcje/i,
  /nowe\s+instrukcje\s*:/i,
  /zmień\s+(swoje\s+)?zachowanie/i,
  /\[INST\]/i, // Llama/Mistral prompt injection
  /\[SYSTEM\]/i,
  /<<<|>>>/, // delimiter injection
  /<\|.*?\|>/, // special token injection
  /###\s*(?:instruction|system|human|assistant)/i,
];

/** Binary / image data that the bot cannot process */
const IMAGE_PATTERNS: RegExp[] = [
  /data:image\//i,
  /data:application\//i,
  /base64\s*,/i,
];

/** Polish profanity — common roots with word boundaries where safe */
const PROFANITY_PATTERNS: RegExp[] = [
  /\bkurw[aąy]\b/i,
  /\bchuj\b/i,
  /\bjeba[cć]\b/i,
  /\bpierdol/i,
  /\bspierdal/i,
  /\bskurw/i,
  /\bdupek\b/i,
  /\bjeb[aią]\b/i,
  /\bpizd/i,
  /\bcipa\b/i,
  /\bhuj\b/i,
  /\bmotherfuck/i,
  /\bfuck\s+you\b/i,
  /\bfucking\b/i,
  /\bbitch\b/i,
  /\basshole\b/i,
  /\bshit\b/i,
];

/**
 * Pure greetings — message is ONLY a greeting, nothing more.
 * We match start+end to avoid "hej, ile kosztuje manicure?" being caught.
 */
const GREETING_ONLY_PATTERNS: RegExp[] = [
  /^(hej|hej hej|cześć|czesc|siema|siemka|siemanko|siemaneczko|yo|elo|elo elo|hej elo|witaj|witajcie|no hej|no cześć|no czesc)[\s!.,?😊]*$/iu,
  /^(dzień dobry|dzien dobry|dobry wieczór|dobry wieczor|dobry ranek|dobranoc)[\s!.,?😊]*$/iu,
  /^(good\s+morning|good\s+evening|good\s+night|good\s+afternoon|hello|hi+|hey+|greetings)[\s!.,?😊]*$/iu,
];

/**
 * Casual acknowledgments — conversational continuers that need no RAG lookup.
 * "okej fajnie", "dzięki", "super" etc. → let AI respond naturally in-character.
 */
const ACKNOWLEDGMENT_PATTERNS: RegExp[] = [
  /^(ok|oki|oke|okej|okay|okey)[\s!.,?😊]*$/iu,
  /^(okej\s+(fajnie|super|spoko|dzięki|dzieki|cool|git|ekstra)|ok\s+(dzięki|dzieki|spoko)|okay\s+cool)[\s!.,?😊]*$/iu,
  /^(dzięki|dzieki|dziękuję|dziekuje|thx|thanks|thank\s+you)[\s!.,?😊]*$/iu,
  /^(super|fajnie|ekstra|świetnie|swietnie|spoko|git|cool|nice|bomba|rewelacja)[\s!.,?😊]*$/iu,
  /^(rozumiem|jasne|no\s+tak|no\s+jasne|aha+|mhm+|uhm|yep|yup|tak)[\s!.,?😊]*$/iu,
  /^(rozumiem\s+dzięki|jasne\s+dzięki|ok\s+rozumiem|super\s+dzięki|fajnie\s+dzięki)[\s!.,?😊]*$/iu,
];

const FAREWELL_ONLY_PATTERNS: RegExp[] = [
  /^(pa|pa pa|papa|do widzenia|do zobaczenia|żegnaj|zegnaj|na razie|nara|trzymaj się|trzymaj sie)[\s!.,?😊]*$/iu,
  /^(bye+|goodbye|see you|ciao|later|take care)[\s!.,?😊]*$/iu,
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Gibberish detection: fewer than 25% alphabetic characters in a message
 * longer than 8 chars suggests keyboard-smashing or encoded payloads.
 */
function isGibberish(text: string): boolean {
  if (text.length < 9) return false;
  const letters = (text.match(/[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g) ?? []).length;
  return letters / text.length < 0.25;
}

/** Strip URLs — bot doesn't browse the internet; links add no value to RAG */
function stripUrls(text: string): string {
  return text
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/www\.[^\s]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function matches(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

// ── Canned responses ───────────────────────────────────────────────────────────

const RESPONSE_INJECTION =
  'Przepraszam, ale tej prośby nie mogę wykonać. ' +
  'Chętnie odpowiem na pytania dotyczące naszych usług.';

const RESPONSE_IMAGE =
  'Przepraszam, ale nie mogę przetwarzać obrazów, plików ani danych binarnych. ' +
  'Proszę opisać pytanie słowami — chętnie pomogę.';

const RESPONSE_PROFANITY =
  'Proszę o kulturalną rozmowę. ' +
  'Chętnie odpowiem na pytania dotyczące naszych usług.';

const RESPONSE_GIBBERISH =
  'Przepraszam, nie zrozumiałem wiadomości. ' +
  'Proszę sformułować pytanie inaczej — chętnie pomogę.';

const RESPONSE_FAREWELL =
  'Do widzenia! Jeśli pojawią się pytania, zawsze chętnie pomogę. Miłego dnia!';

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * Run all safety and UX checks on a raw chat message.
 *
 * Call this as the FIRST step in ChatService.sendMessage(), before any
 * database access or OpenAI calls.
 */
export function preprocessMessage(raw: string): PreprocessResult {
  const trimmed = raw.trim();

  // 1. Script / HTML injection
  if (matches(trimmed, SCRIPT_PATTERNS)) {
    return { action: 'respond', response: RESPONSE_INJECTION };
  }

  // 2. Prompt injection
  if (matches(trimmed, PROMPT_INJECTION_PATTERNS)) {
    return { action: 'respond', response: RESPONSE_INJECTION };
  }

  // 3. Image / binary data
  if (matches(trimmed, IMAGE_PATTERNS)) {
    return { action: 'respond', response: RESPONSE_IMAGE };
  }

  // 4. Profanity
  if (matches(trimmed, PROFANITY_PATTERNS)) {
    return { action: 'respond', response: RESPONSE_PROFANITY };
  }

  // 5. Gibberish / keyboard spam
  if (isGibberish(trimmed)) {
    return { action: 'respond', response: RESPONSE_GIBBERISH };
  }

  // 6. Pure farewell — canned, no AI call needed
  if (matches(trimmed, FAREWELL_ONLY_PATTERNS)) {
    return { action: 'respond', response: RESPONSE_FAREWELL };
  }

  // 7. Pure greeting — let AI respond in-character, but skip RAG
  if (matches(trimmed, GREETING_ONLY_PATTERNS)) {
    return { action: 'no-rag', text: trimmed };
  }

  // 8. Casual acknowledgment — conversational continuer, skip RAG
  if (matches(trimmed, ACKNOWLEDGMENT_PATTERNS)) {
    return { action: 'no-rag', text: trimmed };
  }

  // 9. Strip URLs and proceed through the normal pipeline
  const clean = stripUrls(trimmed);
  if (!clean) {
    return { action: 'respond', response: RESPONSE_GIBBERISH };
  }

  return { action: 'proceed', text: clean };
}

// ── Lead intent detection (auto-open lead form) ──────────────────────────────

export interface LeadIntentSignal {
  /** Confident the user is offering/asking for contact → open the form now. */
  hard: boolean;
  /** Ambiguous — worth a cheap model check before deciding. */
  soft: boolean;
}

/** An email address anywhere in the message. */
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
/** A run of digits/separators long enough to be a phone number. */
const PHONE_RE = /(?:\+?\d[\s\-().]?){9,}/;

/** Explicit "contact me / here's my number" phrases (diacritic-insensitive). */
const LEAD_INTENT_PHRASES = [
  'prosze o kontakt',
  'prosze o telefon',
  'prosze o oddzwonienie',
  'prosze o wycene',
  'prosze sie skontaktowac',
  'moj numer',
  'moj telefon',
  'moj mail',
  'moj e-mail',
  'moj adres',
  'zadzwoncie',
  'mozecie zadzwonic',
  'skontaktujcie sie',
  'chce sie umowic',
  'umowcie mnie',
  'chce sie zapisac',
  'zapiszcie mnie',
  'chce zostawic kontakt',
  'zostawiam kontakt',
  'moge zostawic',
  'zostaw moje dane',
  'zapisz moje dane',
  // Explicit "lead" vocabulary — users literally type these to request capture.
  'zapisz mojego leada',
  'zapisz leada',
  'dodaj leada',
  'nowy lead',
  'chce zostawic leada',
  'zapisz mnie jako lead',
];

/** Soft keywords: alone they don't open the form, only trigger the model check. */
const LEAD_SOFT_KEYWORDS = [
  'kontakt',
  'telefon',
  'mail',
  'e-mail',
  'umowic',
  'spotkanie',
  'wizyta',
  'wycena',
  'oferta',
  'zapisac',
  'zapisz',
  'lead',
  'rezerwacja',
  'termin',
  'zadzwonic',
  'oddzwonic',
];

function normalizeForIntent(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Heuristic first pass for "user wants to leave / is asking for contact".
 * `hard` opens the lead form immediately; `soft` signals an ambiguous case
 * worth escalating to a cheap model classification. Both false → do nothing.
 *
 * Note: some phrases overlap with ChatService's ESCALATION_KEYWORDS
 * (e.g. "oddzwoń"). That's harmless — escalation is checked earlier and
 * returns before this runs.
 */
export function detectLeadIntent(message: string): LeadIntentSignal {
  const norm = normalizeForIntent(message);
  const digitCount = (message.match(/\d/g) ?? []).length;

  const hard =
    EMAIL_RE.test(message) ||
    (digitCount >= 9 && PHONE_RE.test(message)) ||
    LEAD_INTENT_PHRASES.some((p) => norm.includes(p));

  const soft =
    !hard &&
    (LEAD_SOFT_KEYWORDS.some((k) => norm.includes(k)) ||
      (digitCount >= 6 && digitCount < 9));

  return { hard, soft };
}
