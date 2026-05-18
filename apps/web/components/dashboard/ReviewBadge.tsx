'use client';

import { Star, X, MessageSquare } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '../../lib/supabase';

const LS_SUBMITTED = 'botiko_review_submitted';
const LS_DISMISSED_AT = 'botiko_review_dismissed_at';
const MIN_ACCOUNT_AGE_DAYS = 5;
const DISMISS_COOLDOWN_DAYS = 30;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function ReviewBadge() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem(LS_SUBMITTED)) return;

    const dismissedAt = localStorage.getItem(LS_DISMISSED_AT);
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / 86_400_000;
      if (daysSince < DISMISS_COOLDOWN_DAYS) return;
    }

    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (!session) return;

      tokenRef.current = session.access_token;

      const createdAt = new Date(session.user.created_at).getTime();
      const ageDays = (Date.now() - createdAt) / 86_400_000;
      if (ageDays >= MIN_ACCOUNT_AGE_DAYS) {
        setVisible(true);
      }
    });
  }, []);

  function dismiss() {
    localStorage.setItem(LS_DISMISSED_AT, String(Date.now()));
    setVisible(false);
  }

  async function submit() {
    if (!rating || !tokenRef.current) return;
    setSubmitting(true);

    try {
      await fetch(`${API_URL}/api/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenRef.current}`,
        },
        body: JSON.stringify({ rating, message: message.trim() || undefined }),
      });

      localStorage.setItem(LS_SUBMITTED, '1');
      setSubmitted(true);
      setTimeout(() => setVisible(false), 2500);
    } catch {
      // silently fail — don't block the user
    } finally {
      setSubmitting(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-indigo-600 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <MessageSquare size={16} />
              <span className="text-sm font-semibold">
                {submitted ? 'Dziękujemy!' : 'Jak oceniasz Botiko?'}
              </span>
            </div>
            <button
              onClick={dismiss}
              className="text-indigo-200 transition-colors hover:text-white"
              aria-label="Zamknij"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4">
            {submitted ? (
              <p className="text-center text-sm text-slate-600">
                Twoja opinia pomoże nam się rozwijać.
              </p>
            ) : (
              <>
                <div className="mb-3 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                      aria-label={`${star} gwiazdek`}
                    >
                      <Star
                        size={28}
                        className={
                          star <= (hovered || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Opcjonalny komentarz…"
                    maxLength={500}
                    rows={3}
                    className="mb-3 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                )}

                <button
                  onClick={submit}
                  disabled={!rating || submitting}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Wysyłam…' : 'Wyślij opinię'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl"
      >
        <Star size={16} className={rating ? 'fill-amber-300 text-amber-300' : 'text-white'} />
        Oceń Botiko
      </button>
    </div>
  );
}
