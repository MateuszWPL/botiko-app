import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Strona nie znaleziona (404) — Botiko.pl',
  description: 'Botiko nie odnalazło tej strony, ale z łatwością znajduje odpowiedzi dla klientów.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navbar forceScrolled={true} />

      <main className="flex-1 flex flex-col justify-center py-16 relative">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            backgroundPosition: 'center',
          }}
        />
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 w-full text-center mt-20">
        {/* Icon & 404 tag */}
        <div className="mb-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="w-16 h-16 bg-white border border-indigo-100 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/50 mb-6 overflow-hidden">
            <Image
              src="/BotikoLogo.png"
              alt="Botiko"
              width={36}
              height={36}
              className="rounded-xl shadow-sm"
            />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/50 border border-slate-300/50 text-slate-600 text-sm font-semibold tracking-wide uppercase">
            Błąd 404
          </span>
        </div>

        {/* Main Text */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Botiko nie odnalazło <span className="text-indigo-600">tej strony.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          Ale nasz asystent sztucznej inteligencji codziennie świetnie radzi sobie w odnajdywaniu błyskawicznych odpowiedzi na pytania Twoich klientów. Zobacz zresztą sam!
        </p>

        {/* Primary CTA */}
        <div className="flex justify-center mb-24 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <Link
            href="/rejestracja"
            className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/30 hover:-translate-y-1 transition-all"
          >
            Przetestuj za darmo przez 14 dni
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
      </main>

      <Footer />
    </div>
  );
}
