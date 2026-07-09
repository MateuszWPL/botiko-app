#!/usr/bin/env node
/**
 * audit-blog.mjs: sprawdza blog MDX pod kątem:
 * 1. Brakujące obrazki (frontmatter image)
 * 2. Broken href w CTABlock/DownloadPdf/buttonText
 * 3. Znaki "TL;DR:" i potencjalne artefakty specjalne
 *
 * Użycie: node scripts/audit-blog.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve('apps/web');
const BLOG_DIR = join(ROOT, 'content/blog');
const PUBLIC_DIR = join(ROOT, 'public');

// Known valid routes in the app (add more as needed)
const KNOWN_ROUTES = new Set([
  '/',
  '/kontakt',
  '/cennik',
  '/blog',
  '/register',
  '/login',
  '/dla/salon-beauty',
  '/dla/gabinet-spa',
  '/dla/restauracja',
  '/dla/warsztat-mechaniczny',
  '/dla/inna',
  '/polityka-prywatnosci',
  '/regulamin',
  '/prywatnosc',
]);

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

const issues = [];

for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  const content = readFileSync(join(BLOG_DIR, file), 'utf-8');
  const lines = content.split('\n');

  // 1. Extract frontmatter image
  const imageMatch = content.match(/^image:\s*["']?([^"'\n]+)["']?/m);
  if (imageMatch) {
    const imgPath = imageMatch[1].trim();
    const diskPath = join(PUBLIC_DIR, imgPath);
    if (!existsSync(diskPath)) {
      issues.push({ file, type: 'MISSING_IMAGE', detail: imgPath });
    }
  } else {
    issues.push({ file, type: 'NO_IMAGE_FRONTMATTER', detail: 'brak pola image:' });
  }

  // 2. Find href attributes
  const hrefRegex = /href=["']([^"']+)["']/g;
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    const href = m[1];
    const lineNum = content.substring(0, m.index).split('\n').length;

    // Skip external URLs and anchors
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) continue;

    // Check if it's a known route
    if (KNOWN_ROUTES.has(href)) continue;

    // Check if it's a file in public/
    const diskPath = join(PUBLIC_DIR, href);
    if (existsSync(diskPath)) continue;

    // Check if it's a blog route
    if (href.startsWith('/blog/')) {
      const blogSlug = href.replace('/blog/', '').replace(/\/$/, '');
      const blogFile = join(BLOG_DIR, `${blogSlug}.mdx`);
      if (existsSync(blogFile)) continue;
    }

    issues.push({ file, type: 'BROKEN_HREF', detail: `L${lineNum}: ${href}` });
  }

  // 3. TL;DR artifacts: check for non-standard encoding around it
  lines.forEach((line, idx) => {
    if (/TL;?DR/i.test(line)) {
      // Check if it contains odd characters (non-standard quotes, broken encoding)
      if (/[“”‘’–—]/.test(line)) {
        issues.push({ file, type: 'TLDR_SMART_QUOTES', detail: `L${idx + 1}: ${line.trim().slice(0, 80)}` });
      }
      // Check for raw TL;DR: that might confuse parsers if not in a code block or component
      if (/^\*\*TL;DR/.test(line.trim()) || /^TL;DR/.test(line.trim())) {
        issues.push({ file, type: 'TLDR_RAW', detail: `L${idx + 1}: ${line.trim().slice(0, 80)}` });
      }
    }
  });
}

// Summary
if (issues.length === 0) {
  console.log('Blog audit: wszystko OK!');
} else {
  console.log(`\nBlog audit: ${issues.length} problemow w ${[...new Set(issues.map(i => i.file))].length} plikach\n`);

  const byType = {};
  for (const issue of issues) {
    if (!byType[issue.type]) byType[issue.type] = [];
    byType[issue.type].push(issue);
  }

  for (const [type, list] of Object.entries(byType)) {
    console.log(`\n=== ${type} (${list.length}) ===`);
    for (const item of list) {
      console.log(`  ${item.file}: ${item.detail}`);
    }
  }
}
