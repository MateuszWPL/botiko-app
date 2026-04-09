import ScrollReveal from './ScrollReveal';

const TESTIMONIALS = [
  {
    quote:
      'Pierwszego dnia bot zebrał 3 zapytania o wizyty — wszystkie po 20:00. Nie odbierałam telefonu, a miałam pełny grafik na tydzień.',
    name: 'Katarzyna M.',
    role: 'Właścicielka Salon K., Wrocław',
    industry: 'Salon beauty',
    industryColor: '#EC4899',
    emoji: '💅',
    stars: 5,
  },
  {
    quote:
      'Miałam obawy że bot "nie zrozumie" pytań o zabiegi. Myliłam się — odpowiada lepiej niż ja, bo zna cennik na pamięć i nigdy nie jest zmęczona.',
    name: 'Agnieszka T.',
    role: 'Fizjoterapeutka, Kraków',
    industry: 'Gabinet',
    industryColor: '#06B6D4',
    emoji: '🏥',
    stars: 5,
  },
  {
    quote:
      'Najlepsza decyzja tego roku. Bot obsługuje pytania o menu, rezerwacje i alergie. Kelnerzy mogą skupić się na gościach przy stole.',
    name: 'Marek B.',
    role: 'Restauracja Smak, Poznań',
    industry: 'Restauracja',
    industryColor: '#F97316',
    emoji: '🍽️',
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-warning text-base">★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Opinie klientów</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Co mówią właścicielki,{' '}
            <span className="gradient-text">które już korzystają</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={(i + 1) as 1 | 2 | 3} className="h-full">
              <div className="h-full flex flex-col bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <Stars count={t.stars} />

                <blockquote className="mt-4 mb-6 text-slate-700 leading-relaxed flex-1 text-sm">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${t.industryColor}15` }}
                  >
                    {t.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                  <span
                    className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${t.industryColor}12`, color: t.industryColor }}
                  >
                    {t.industry}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Social proof numbers */}
        <ScrollReveal className="mt-14">
          <div
            className="rounded-3xl p-8 grid sm:grid-cols-3 gap-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
            }}
          >
            {[
              { value: '12 000+', label: 'rozmów obsłużonych w tym miesiącu' },
              { value: '98%', label: 'klientów poleca Botiko znajomym' },
              { value: '< 15 min', label: 'średni czas wdrożenia bota' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                <p className="text-indigo-200 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
