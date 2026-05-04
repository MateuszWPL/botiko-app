import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import InfoBox from './InfoBox';
import ImageGallery from './ImageGallery';
import VideoEmbed from './VideoEmbed';
import CallToAction from './CallToAction';
import DownloadPdf from './DownloadPdf';
import { Callout } from './Callout';
import { CTABlock } from './CTABlock';
import { ComparisonTable } from './ComparisonTable';
import { FAQ } from './FAQ';
import { ROICalculator } from './ROICalculator';

// Custom blog components available inside MDX files
export const mdxComponents = {
  InfoBox,
  ImageGallery,
  VideoEmbed,
  CallToAction,
  DownloadPdf,
  Callout,
  CTABlock,
  ComparisonTable,
  FAQ,
  ROICalculator,

  img: ({ src, alt }: ComponentPropsWithoutRef<'img'>) => (
    <figure className="my-8">
      <div className="relative w-full rounded-xl overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ''}
          className="w-full h-auto rounded-xl"
          loading="lazy"
        />
      </div>
      {alt && (
        <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#');
    if (isInternal) {
      return (
        <Link
          href={href ?? '#'}
          className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
          {...rest}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
        {...rest}
      >
        {children}
      </a>
    );
  },

  h2: ({ children, id }: ComponentPropsWithoutRef<'h2'>) => (
    <h2 id={id} className="text-2xl font-bold text-slate-900 mt-12 mb-4 scroll-mt-24">
      {children}
    </h2>
  ),

  h3: ({ children, id }: ComponentPropsWithoutRef<'h3'>) => (
    <h3 id={id} className="text-xl font-semibold text-slate-900 mt-8 mb-3 scroll-mt-24">
      {children}
    </h3>
  ),

  h4: ({ children, id }: ComponentPropsWithoutRef<'h4'>) => (
    <h4 id={id} className="text-lg font-semibold text-slate-800 mt-6 mb-2 scroll-mt-24">
      {children}
    </h4>
  ),

  p: ({ children }: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-slate-700 leading-relaxed mb-5">{children}</p>
  ),

  ul: ({ children }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="my-5 space-y-2 pl-0 list-none">{children}</ul>
  ),

  ol: ({ children }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="my-5 space-y-2 pl-5 list-decimal list-outside">{children}</ol>
  ),

  li: ({ children }: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-slate-700 leading-relaxed flex gap-2">
      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500" />
      <span>{children}</span>
    </li>
  ),

  blockquote: ({ children }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-6 border-l-4 border-indigo-400 pl-5 italic text-slate-600 bg-indigo-50/50 py-3 pr-4 rounded-r-lg">
      {children}
    </blockquote>
  ),

  table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">{children}</table>
    </div>
  ),

  thead: ({ children }: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-slate-50">{children}</thead>
  ),

  th: ({ children }: ComponentPropsWithoutRef<'th'>) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {children}
    </th>
  ),

  td: ({ children }: ComponentPropsWithoutRef<'td'>) => (
    <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">
      {children}
    </td>
  ),

  tr: ({ children }: ComponentPropsWithoutRef<'tr'>) => (
    <tr className="hover:bg-slate-50 transition-colors">{children}</tr>
  ),

  code: ({ children, className }: ComponentPropsWithoutRef<'code'>) => {
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 text-sm font-mono">
          {children}
        </code>
      );
    }
    return <code className={`${className} text-sm`}>{children}</code>;
  },

  pre: ({ children }: ComponentPropsWithoutRef<'pre'>) => (
    <pre className="my-6 p-5 rounded-xl bg-slate-900 overflow-x-auto text-slate-100 text-sm leading-relaxed">
      {children}
    </pre>
  ),

  hr: () => <hr className="my-10 border-slate-200" />,

  strong: ({ children }: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
};
