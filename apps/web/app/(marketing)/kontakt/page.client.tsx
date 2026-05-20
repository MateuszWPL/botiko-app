'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { webEnv } from '@/lib/env';

type ContactTopic = 'DEMO' | 'WDROZENIE' | 'CENNIK' | 'WSPOLPRACA' | 'INNE';

const TOPIC_LABEL: Record<ContactTopic, string> = {
  DEMO: 'Chcę zobaczyć demo',
  WDROZENIE: 'Wdrożenie na stronie',
  CENNIK: 'Pytanie o plan / fakturę',
  WSPOLPRACA: 'Współpraca / partnerstwo',
  INNE: 'Inne',
};

const CONTACT_EMAIL = 'kontakt@botiko.pl';

async function submitContactForm(payload: {
  topic: ContactTopic;
  message: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
}) {
  const res = await fetch(`${webEnv.API_URL}/api/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Contact submit failed: ${res.status}`);
  }
}

function buildMailto(params: {
  name: string;
  email: string;
  website?: string;
  company?: string;
  topic: ContactTopic;
  message: string;
}) {
  const subject = `Botiko — kontakt: ${TOPIC_LABEL[params.topic]}`;
  const lines = [
    `Imię: ${params.name}`,
    `E-mail: ${params.email}`,
    params.company ? `Firma: ${params.company}` : undefined,
    params.website ? `Strona: ${params.website}` : undefined,
    `Temat: ${TOPIC_LABEL[params.topic]}`,
    '',
    params.message,
  ].filter(Boolean);

  const body = lines.join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function CheckIcon({ color = '#10B981' }: { color?: string }) {
  return (
    <span
      aria-hidden
      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Stepper({ step, submitted }: { step: 1 | 2; submitted: boolean }) {
  const steps = useMemo(
    () => [
      { num: 1, label: 'Twoje potrzeby' },
      { num: 2, label: 'Dane kontaktowe' },
    ],
    [],
  );

  return (
    <div className="flex items-center gap-4">
      {steps.map((s, idx) => {
        const done = s.num < step || (s.num === 2 && submitted);
        const active = s.num === step && !submitted;
        return (
          <div key={s.num} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold"
              style={{
                background: done ? '#10B981' : active ? '#6366F1' : '#E2E8F0',
                color: done || active ? '#fff' : '#64748B',
              }}
            >
              {done ? '✓' : s.num}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold" style={{ color: active ? '#0F172A' : '#64748B' }}>
                {s.label}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-10 h-px bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ContactPageClient() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [topic, setTopic] = useState<ContactTopic>('DEMO');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [company, setCompany] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Lustrzane do create-contact.dto.ts — żeby front nie przepuszczał danych,
  // które backend i tak odrzuci.
  const emailLooksValid = /^\S+@\S+\.\S+$/.test(email.trim());
  const canGoStep2 =
    message.trim().length >= 10 && message.trim().length <= 4000;
  const canSubmit =
    name.trim().length >= 2 &&
    emailLooksValid &&
    message.trim().length >= 10 &&
    message.trim().length <= 4000;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Backend waliduje website przez .url() — wymaga protokołu.
      const normalizedWebsite = website.trim()
        ? /^https?:\/\//i.test(website.trim())
          ? website.trim()
          : `https://${website.trim()}`
        : undefined;
      await submitContactForm({
        topic,
        message,
        name,
        email,
        company: company || undefined,
        website: normalizedWebsite,
      });
      setSubmitted(true);
    } catch {
      setSubmitError('Nie udało się wysłać formularza. Skorzystaj z maila poniżej.');
      const mailto = buildMailto({ name, email, website: website || undefined, company: company || undefined, topic, message });
      window.location.href = mailto;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="min-h-screen pt-28 pb-16"
      style={{
        background: 'linear-gradient(160deg, #0b1224 0%, #0f1b3a 40%, #111827 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Left */}
          <div className="text-white flex flex-col">
            <p className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(199,210,254,0.95)' }}
            >
              Porozmawiajmy
            </p>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Zwiększ obsługę klienta
              <br />
              <span style={{ color: '#A5B4FC' }}>bez tracenia zaufania.</span>
            </h1>

            <p className="mt-4 text-indigo-200 text-base leading-relaxed max-w-xl">
              Napisz, z czym chcesz wystartować. Odpowiemy i podpowiemy, jak wdrożyć bota na Twojej stronie — szybko i sensownie.
            </p>

            <ul className="mt-5 space-y-3 max-w-xl">
              {[
                'Dobierzemy najlepszy szablon dla Twojej branży',
                'Powiem Ci, co warto wrzucić do bazy wiedzy (żeby bot był konkretny)',
                'Damy gotowy fragment kodu i pomożemy w instalacji',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-indigo-100 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>

            {/* Founder card — honest, no fake testimonial */}
            <div className="mt-6 max-w-xl" style={{ position: 'relative', zIndex: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-1px',
                  borderRadius: '1rem',
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.3) 0%, transparent 70%)',
                  filter: 'blur(14px)',
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.055)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)',
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.35) 0%, rgba(6,182,212,0.25) 100%)',
                      border: '1px solid rgba(110,231,183,0.3)',
                      color: '#A7F3D0',
                      boxShadow: '0 0 12px rgba(16,185,129,0.25)',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Odpowiadam osobiście
                  </span>
                </div>

                <p className="text-indigo-100 leading-relaxed" style={{ fontSize: '15px' }}>
                  Pisze do Ciebie ktoś z zespołu Botiko — nie bot filtrujący zapytania, nie automatyczna kolejka.
                  Odpowiadamy w ciągu 1 dnia roboczego.
                </p>

                <div
                  style={{
                    height: '1px',
                    margin: '1rem 0',
                    background: 'linear-gradient(90deg, rgba(165,180,252,0.18) 0%, rgba(165,180,252,0.04) 100%)',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      boxShadow: '0 0 0 2px rgba(165,180,252,0.2)',
                      overflow: 'hidden',
                    }}
                  >
                    <Image src="/botiko-mark-white.svg" alt="" width={20} height={25} style={{ display: 'block' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Zespół Botiko</p>
                    <p style={{ fontSize: '12px', color: '#A5B4FC' }}>Białystok · Polska</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-auto pt-6 text-sm text-indigo-300">
              Wolisz od razu napisać mail?{' '}
              <a className="text-white font-semibold underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          {/* Right */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="px-7 py-6 border-b border-slate-100 bg-slate-50">
              <Stepper step={step} submitted={submitted} />
            </div>

            <div className="p-7 flex-1">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">Wiadomość wysłana</h2>
                  <p className="text-slate-600 mt-2 leading-relaxed">
                    Dzięki! Odpowiemy zwykle w ciągu 1 dnia roboczego.
                  </p>
                  <p className="text-xs text-slate-500 mt-6">
                    Jeśli wolisz, możesz też napisać bezpośrednio na{' '}
                    <a className="text-brand font-semibold hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
              ) : step === 1 ? (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Temat</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.currentTarget.value as ContactTopic)}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    >
                      {Object.entries(TOPIC_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Firma (opcjonalnie)</label>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.currentTarget.value)}
                        placeholder="Nazwa firmy"
                        maxLength={120}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Strona (opcjonalnie)</label>
                      <input
                        value={website}
                        onChange={(e) => setWebsite(e.currentTarget.value)}
                        placeholder="https://twojastrona.pl"
                        maxLength={2048}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-900">Wiadomość</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.currentTarget.value)}
                      placeholder="Napisz krótko: branża, co sprzedajesz, jakie pytania zadają klienci, gdzie chcesz mieć bota (strona / Messenger / inne)."
                      rows={6}
                      maxLength={4000}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Minimum 10 znaków. Im więcej konkretów, tym lepsza odpowiedź.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-slate-500">
                      Pisząc do nas zgadzasz się na kontakt w sprawie Twojego zapytania.
                    </p>
                    <button
                      type="button"
                      disabled={!canGoStep2}
                      onClick={() => setStep(2)}
                      className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
                    >
                      Dalej
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Imię</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                        placeholder="Jak się do Ciebie zwracać?"
                        maxLength={80}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-900">E-mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        placeholder="Twój e-mail"
                        maxLength={254}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 12H5m7 7-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Wstecz
                    </button>
                    <button
                      type="button"
                      disabled={!canSubmit || submitting}
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-extrabold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                    >
                      {submitting ? 'Wysyłam…' : 'Wyślij'}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-600">
                      {submitError}
                    </p>
                  )}

                  <p className="text-xs text-slate-500">
                    Jeśli nic się nie otworzy, napisz bezpośrednio na{' '}
                    <a className="text-brand font-semibold hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>

            <div className="px-7 py-5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
              Odpowiadamy zwykle w ciągu 1 dnia roboczego.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

