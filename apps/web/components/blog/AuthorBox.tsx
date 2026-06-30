import { Globe } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '@/components/icons/SocialIcons';
import { AUTHOR } from '@/lib/author';

/**
 * Box „o autorze" pod wpisem — realne autorstwo (imię, rola, doświadczenie,
 * profile). Kluczowy sygnał E-E-A-T: konkretna osoba stoi za treścią.
 */
export default function AuthorBox() {
  return (
    <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-14 h-14 rounded-full bg-brand-soft text-brand flex items-center justify-center text-lg font-bold">
          {AUTHOR.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            O autorze
          </p>
          <p className="text-base font-bold text-slate-900">{AUTHOR.name}</p>
          <p className="text-sm text-brand font-medium mb-2">{AUTHOR.role}</p>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            {AUTHOR.bio}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={AUTHOR.sameAs[0]}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="LinkedIn — Mateusz Woronowicz"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={AUTHOR.sameAs[1]}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="GitHub — MateuszWPL"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              GitHub
            </a>
            <a
              href={AUTHOR.sameAs[2]}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="Strona prywatna — mateuszworonowicz.pl"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand transition-colors"
            >
              <Globe className="w-4 h-4" />
              mateuszworonowicz.pl
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
