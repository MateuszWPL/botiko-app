import Link from 'next/link';

export default function CallToAction({
  title,
  description,
  href,
  buttonText = 'Zacznij teraz',
}: {
  title: string;
  description?: string;
  href: string;
  buttonText?: string;
}) {
  return (
    <div className="my-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white text-center">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-indigo-100 text-sm mb-6 max-w-lg mx-auto">
          {description}
        </p>
      )}
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-700 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
      >
        {buttonText}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
