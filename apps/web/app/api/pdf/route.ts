import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PAGES = 50;
const CHUNK_SIZE = 800;       // characters per chunk
const CHUNK_OVERLAP = 100;    // overlap between chunks
const MIN_CHUNK_LENGTH = 30;  // discard very short chunks (noise)

/** Split text into overlapping chunks, preferring natural break points. */
function splitIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + CHUNK_SIZE;

    if (end < text.length) {
      const searchFrom = Math.max(start + CHUNK_SIZE - 150, start);
      const window = text.slice(searchFrom, Math.min(searchFrom + 300, text.length));
      const paraBreak = window.lastIndexOf('\n\n');
      const sentBreak = window.search(/[.!?]\s/);
      const spaceBreak = window.lastIndexOf(' ');

      if (paraBreak !== -1) end = searchFrom + paraBreak + 2;
      else if (sentBreak !== -1 && sentBreak < 200) end = searchFrom + sentBreak + 2;
      else if (spaceBreak !== -1) end = searchFrom + spaceBreak + 1;
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length >= MIN_CHUNK_LENGTH) chunks.push(chunk);
    start = Math.max(end - CHUNK_OVERLAP, start + 1);
  }

  return chunks;
}

/** Clean up extracted PDF text. */
function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*\d+\s*$/gm, '')  // strip lone page numbers
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get('content-type') ?? '';
    if (!ct.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Brak pliku' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Dozwolone tylko pliki PDF' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Plik przekracza limit 5 MB' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // pdf-parse v2: pass data as Uint8Array
    let text = '';
    let totalPages = 0;
    try {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const info = await parser.getInfo({ parsePageInfo: true });
      totalPages = (info as unknown as { total?: number }).total ?? 0;

      if (totalPages > MAX_PAGES) {
        await parser.destroy();
        return NextResponse.json(
          { error: `PDF ma zbyt wiele stron (max ${MAX_PAGES})` },
          { status: 422 },
        );
      }

      const result = await parser.getText();
      text = typeof result === 'string' ? result : (result as { text?: string }).text ?? '';
      await parser.destroy();
    } catch {
      return NextResponse.json(
        { error: 'Nie udało się odczytać pliku PDF. Sprawdź czy plik nie jest uszkodzony.' },
        { status: 422 },
      );
    }

    const clean = cleanText(text);
    if (clean.length < 50) {
      return NextResponse.json(
        { error: 'PDF nie zawiera tekstu możliwego do odczytania. Sprawdź czy nie jest skanem bez warstwy OCR.' },
        { status: 422 },
      );
    }

    const chunks = splitIntoChunks(clean);
    return NextResponse.json({ chunks, pages: totalPages, totalChunks: chunks.length });
  } catch (err) {
    console.error('[PDF route] Error:', err);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

export const maxDuration = 30;
