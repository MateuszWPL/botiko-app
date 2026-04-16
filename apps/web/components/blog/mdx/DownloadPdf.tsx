'use client';

import { useState, useRef } from 'react';
import { PdfBeautySalon } from './pdf-templates/PdfBeautySalon';
import { PdfPhysio } from './pdf-templates/PdfPhysio';

export type SchemaType = 'beauty-salon' | 'physio';

interface DownloadPdfProps {
  title?: string;
  filename?: string;
  label?: string;
  schemaType?: SchemaType;
}

export default function DownloadPdf({
  title = 'Schemat chatbota',
  filename = 'botiko-schemat',
  label = 'Pobierz PDF',
  schemaType = 'beauty-salon',
}: DownloadPdfProps) {
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setLoading(true);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error('Napotkano błąd podczas generowania PDF:', err);
      alert('Nie udało się wygenerować PDF. Spróbuj ponownie za chwilę.');
    } finally {
      setLoading(false);
    }
  };

  const templateMap: Record<SchemaType, React.ReactNode> = {
    'beauty-salon': <PdfBeautySalon title={title} />,
    'physio': <PdfPhysio title={title} />,
  };

  return (
    <div className="my-8">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff' }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Generowanie pliku...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {label}
          </span>
        )}
      </button>
      <p className="mt-2 text-xs" style={{ color: '#94a3b8' }}>
        Bezpłatny szablon · Format A4 · Gotowy do wklejenia w panelu Botiko
      </p>

      {/* Ukryty szablon PDF — pozycja stała poza ekranem */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div ref={printRef} style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
          {templateMap[schemaType]}
        </div>
      </div>
    </div>
  );
}
