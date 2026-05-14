'use client';

import { useState, useMemo } from 'react';
import {
  Phone, Mail, MapPin, Clock, BookOpen, HelpCircle, Info,
  Plus, Trash2, Check, Loader2,
} from 'lucide-react';
import type { ExtractedPayload, ConfirmPayload } from '../../lib/website-import';

interface Props {
  payload: ExtractedPayload;
  onConfirm: (selected: ConfirmPayload) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

type EditableContact = {
  phone: string;
  email: string;
  address: string;
  selected: boolean;
};

type EditableService = {
  name: string;
  description: string;
  price: string;
  selected: boolean;
};

type EditableFaq = {
  question: string;
  answer: string;
  selected: boolean;
};

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 bg-white transition';

const textareaClass =
  'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 bg-white resize-none transition';

function SectionHeader({
  icon: Icon,
  title,
  count,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-50',
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </span>
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
          {count}
        </span>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
        checked
          ? 'bg-indigo-500 border-indigo-500 text-white'
          : 'border-slate-300 hover:border-indigo-400'
      }`}
      title={label ?? (checked ? 'Odznacz' : 'Zaznacz')}
    >
      {checked && <Check className="w-3 h-3" strokeWidth={3} />}
    </button>
  );
}

export function WebsiteImportPreview({ payload, onConfirm, onCancel, loading }: Props) {
  const [contact, setContact] = useState<EditableContact>({
    phone: payload.contact?.phone ?? '',
    email: payload.contact?.email ?? '',
    address: payload.contact?.address ?? '',
    selected: !!(payload.contact?.phone || payload.contact?.email || payload.contact?.address),
  });

  const [services, setServices] = useState<EditableService[]>(
    payload.services.map((s) => ({
      name: s.name,
      description: s.description ?? '',
      price: s.price ?? '',
      selected: true,
    })),
  );

  const [faq, setFaq] = useState<EditableFaq[]>(
    payload.faq.map((f) => ({ ...f, selected: true })),
  );

  const [hours, setHours] = useState({
    raw: payload.hours?.raw ?? '',
    selected: !!(payload.hours?.raw),
  });

  const [about, setAbout] = useState({
    text: payload.about ?? '',
    selected: !!(payload.about),
  });

  const selectedCount = useMemo(() => {
    let n = 0;
    if (contact.selected && (contact.phone || contact.email || contact.address)) n++;
    n += services.filter((s) => s.selected && s.name.trim().length >= 2).length;
    n += faq.filter((f) => f.selected && f.question.trim() && f.answer.trim()).length;
    if (hours.selected && hours.raw.trim()) n++;
    if (about.selected && about.text.trim()) n++;
    return n;
  }, [contact, services, faq, hours, about]);

  const handleConfirm = async () => {
    const payload2: ConfirmPayload = {
      contact: contact.selected ? {
        phone: contact.phone || null,
        email: contact.email || null,
        address: contact.address || null,
        selected: true,
      } : null,
      services: services
        .filter((s) => s.name.trim().length >= 2)
        .map((s) => ({
          name: s.name.trim(),
          description: s.description.trim() || null,
          price: s.price.trim() || null,
          selected: s.selected,
        })),
      faq: faq
        .filter((f) => f.question.trim() && f.answer.trim())
        .map((f) => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
          selected: f.selected,
        })),
      hours: hours.raw.trim()
        ? { raw: hours.raw.trim(), selected: hours.selected }
        : null,
      about: about.text.trim()
        ? { text: about.text.trim(), selected: about.selected }
        : null,
    };
    await onConfirm(payload2);
  };

  const hasAnyContent =
    (payload.contact?.phone || payload.contact?.email || payload.contact?.address) ||
    payload.services.length > 0 ||
    payload.faq.length > 0 ||
    payload.hours?.raw ||
    payload.about;

  return (
    <div className="space-y-4">
      {!hasAnyContent && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Nie znaleziono żadnych danych do zaimportowania na tej stronie.
        </div>
      )}

      {/* Contact */}
      {(payload.contact?.phone || payload.contact?.email || payload.contact?.address) && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={contact.selected}
              onChange={(v) => setContact((c) => ({ ...c, selected: v }))}
            />
            <div className="flex-1 min-w-0">
              <SectionHeader icon={Phone} title="Kontakt" iconColor="text-indigo-600" iconBg="bg-indigo-50" />
              <div className="space-y-2">
                {payload.contact?.phone !== undefined && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <input
                      value={contact.phone}
                      onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                      placeholder="Telefon"
                      className={inputClass}
                    />
                  </div>
                )}
                {payload.contact?.email !== undefined && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <input
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                      placeholder="Email"
                      className={inputClass}
                    />
                  </div>
                )}
                {payload.contact?.address !== undefined && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <input
                      value={contact.address}
                      onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
                      placeholder="Adres"
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services */}
      {payload.services.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <SectionHeader
            icon={BookOpen}
            title="Usługi"
            count={services.filter((s) => s.selected).length}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <div className="space-y-2">
            {services.map((s, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Checkbox
                  checked={s.selected}
                  onChange={(v) =>
                    setServices((prev) =>
                      prev.map((item, j) => (j === i ? { ...item, selected: v } : item)),
                    )
                  }
                />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <input
                    value={s.name}
                    onChange={(e) =>
                      setServices((prev) =>
                        prev.map((item, j) =>
                          j === i ? { ...item, name: e.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Nazwa usługi"
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      value={s.price}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((item, j) =>
                            j === i ? { ...item, price: e.target.value } : item,
                          ),
                        )
                      }
                      placeholder="Cena (opcjonalnie)"
                      className={inputClass}
                    />
                    <input
                      value={s.description}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((item, j) =>
                            j === i ? { ...item, description: e.target.value } : item,
                          ),
                        )
                      }
                      placeholder="Opis (opcjonalnie)"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setServices((prev) => prev.filter((_, j) => j !== i))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setServices((prev) => [
                  ...prev,
                  { name: '', description: '', price: '', selected: true },
                ])
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-emerald-200 hover:border-emerald-400 text-emerald-600 text-xs font-medium rounded-lg transition-all hover:bg-emerald-50/40"
            >
              <Plus className="w-3.5 h-3.5" />
              Dodaj usługę
            </button>
          </div>
        </div>
      )}

      {/* FAQ */}
      {payload.faq.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <SectionHeader
            icon={HelpCircle}
            title="FAQ"
            count={faq.filter((f) => f.selected).length}
            iconColor="text-violet-600"
            iconBg="bg-violet-50"
          />
          <div className="space-y-2">
            {faq.map((f, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Checkbox
                  checked={f.selected}
                  onChange={(v) =>
                    setFaq((prev) =>
                      prev.map((item, j) => (j === i ? { ...item, selected: v } : item)),
                    )
                  }
                />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <input
                    value={f.question}
                    onChange={(e) =>
                      setFaq((prev) =>
                        prev.map((item, j) =>
                          j === i ? { ...item, question: e.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Pytanie"
                    className={inputClass}
                  />
                  <textarea
                    value={f.answer}
                    onChange={(e) =>
                      setFaq((prev) =>
                        prev.map((item, j) =>
                          j === i ? { ...item, answer: e.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Odpowiedź"
                    rows={2}
                    className={textareaClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFaq((prev) => prev.filter((_, j) => j !== i))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFaq((prev) => [
                  ...prev,
                  { question: '', answer: '', selected: true },
                ])
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-violet-200 hover:border-violet-400 text-violet-600 text-xs font-medium rounded-lg transition-all hover:bg-violet-50/40"
            >
              <Plus className="w-3.5 h-3.5" />
              Dodaj pytanie FAQ
            </button>
          </div>
        </div>
      )}

      {/* Hours */}
      {payload.hours?.raw && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={hours.selected}
              onChange={(v) => setHours((h) => ({ ...h, selected: v }))}
            />
            <div className="flex-1 min-w-0">
              <SectionHeader icon={Clock} title="Godziny otwarcia" iconColor="text-sky-600" iconBg="bg-sky-50" />
              <textarea
                value={hours.raw}
                onChange={(e) => setHours((h) => ({ ...h, raw: e.target.value }))}
                rows={2}
                placeholder="np. Pon-Pt 9:00-18:00, Sob 9:00-14:00"
                className={textareaClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* About */}
      {payload.about && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={about.selected}
              onChange={(v) => setAbout((a) => ({ ...a, selected: v }))}
            />
            <div className="flex-1 min-w-0">
              <SectionHeader icon={Info} title="O firmie" iconColor="text-rose-600" iconBg="bg-rose-50" />
              <textarea
                value={about.text}
                onChange={(e) => setAbout((a) => ({ ...a, text: e.target.value }))}
                rows={3}
                placeholder="Krótki opis firmy"
                className={textareaClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 sticky bottom-0 bg-white pb-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50"
        >
          Anuluj
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || selectedCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Zapisz wybrane ({selectedCount})
        </button>
      </div>
    </div>
  );
}
