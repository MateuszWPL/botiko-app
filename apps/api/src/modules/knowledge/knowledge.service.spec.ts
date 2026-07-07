// Factory mocks keep the module body side-effect free (avoid env.ts process.exit)
jest.mock('../../config/env', () => ({ env: {} }));
jest.mock('../../prisma/prisma.service', () => ({ PrismaService: jest.fn() }));
jest.mock('./embedding.service', () => ({ EmbeddingService: jest.fn() }));

import { splitContentIntoChunks, MAX_CHUNK_LENGTH } from './knowledge.service';

describe('splitContentIntoChunks', () => {
  it('keeps a short single paragraph as one chunk', () => {
    const chunks = splitContentIntoChunks('Strzyżenie damskie kosztuje 80 zł.');
    expect(chunks).toEqual(['Strzyżenie damskie kosztuje 80 zł.']);
  });

  it('keeps a long single blob (no blank lines) as one chunk', () => {
    const blob = 'a '.repeat(1500).trim(); // ~3000 chars, no paragraph breaks
    const chunks = splitContentIntoChunks(blob);
    expect(chunks).toHaveLength(1);
  });

  it('splits multi-paragraph content into several chunks under the limit', () => {
    const para = (label: string) => `${label} ${'x'.repeat(700)}`;
    const raw = [para('Cennik'), para('Godziny'), para('FAQ')].join('\n\n');

    const chunks = splitContentIntoChunks(raw);

    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(MAX_CHUNK_LENGTH);
    }
  });

  it('packs small paragraphs together rather than one chunk each', () => {
    const raw = ['Krótki wpis A.', 'Krótki wpis B.', 'Krótki wpis C.'].join(
      '\n\n',
    );
    const chunks = splitContentIntoChunks(raw);
    // All three fit well under the limit → a single packed chunk.
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toContain('Krótki wpis A.');
    expect(chunks[0]).toContain('Krótki wpis C.');
  });

  it('returns [] for empty / whitespace input (caller falls back)', () => {
    expect(splitContentIntoChunks('   \n\n   ')).toEqual([]);
  });
});
