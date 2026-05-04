/**
 * Aktualizuje pole image: w frontmatterze wszystkich postów bloga
 * na podstawie wygenerowanych plików w apps/web/public/blog/
 *
 * Użycie: node scripts/update-blog-image-paths.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'apps', 'web', 'content', 'blog');
const PUBLIC_BLOG = path.join(__dirname, '..', 'apps', 'web', 'public', 'blog');

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
let updated = 0;

for (const filename of files) {
  const slug = filename.replace('.mdx', '');
  const heroPath = `/blog/${slug}-hero.jpg`;
  const heroFile = path.join(PUBLIC_BLOG, `${slug}-hero.jpg`);

  if (!fs.existsSync(heroFile)) {
    console.log(`  SKIP ${slug} (brak hero grafiki)`);
    continue;
  }

  const filePath = path.join(BLOG_DIR, filename);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Zastąp istniejące pole image: lub dodaj przed ---
  if (content.match(/^image:/m)) {
    content = content.replace(/^image:.*$/m, `image: "${heroPath}"`);
  } else {
    content = content.replace(/^(author:)/m, `image: "${heroPath}"\n$1`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  OK  ${slug}`);
  updated++;
}

console.log(`\nZaktualizowano ${updated} postów.`);
