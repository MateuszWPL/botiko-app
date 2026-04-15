export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ę/g, 'e')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ł/g, 'l')
    .replace(/ż/g, 'z')
    .replace(/ź/g, 'z')
    .replace(/ć/g, 'c')
    .replace(/ń/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function dedupeSlug(base: string, counts: Map<string, number>): string {
  const n = (counts.get(base) ?? 0) + 1;
  counts.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
}

