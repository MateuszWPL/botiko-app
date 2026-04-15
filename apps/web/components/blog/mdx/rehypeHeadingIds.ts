import type { Content, Element, Root, Text } from 'hast';
import { visit } from 'unist-util-visit';
import { dedupeSlug, slugify } from '@/lib/slug';

function getText(node: Content): string {
  switch (node.type) {
    case 'text':
      return (node as Text).value ?? '';
    case 'element': {
      const el = node as Element;
      return (el.children as Content[]).map(getText).join('');
    }
    default:
      return '';
  }
}

export function rehypeHeadingIds() {
  return (tree: Root) => {
    const slugCounts = new Map<string, number>();

    visit(tree, 'element', (node: Element) => {
      const tag = node.tagName;
      if (tag !== 'h2' && tag !== 'h3') return;

      const text = (node.children as Content[]).map(getText).join('').trim();
      if (!text) return;

      const base = slugify(text);
      if (!base) return;

      const id = dedupeSlug(base, slugCounts);
      node.properties = node.properties ?? {};
      node.properties.id = id;
    });
  };
}

