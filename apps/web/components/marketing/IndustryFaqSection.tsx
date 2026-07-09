import { FAQ, type FAQItem } from '@/components/blog/mdx/FAQ';

/**
 * Buyer-intent FAQ block for the industry landing pages (/dla/*).
 * Renders the shared accordion with `withSchema={false}`, the page itself
 * emits the FAQPage JSON-LD via `faqPageSchema()` so structured data isn't
 * double-declared (single source of truth, like the city pages).
 */
export default function IndustryFaqSection({
  items,
  heading = 'Najczęstsze pytania',
}: {
  items: FAQItem[];
  heading?: string;
}): JSX.Element | null {
  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-6 text-center">
          {heading}
        </h2>
        <FAQ items={items} withSchema={false} />
      </div>
    </section>
  );
}
