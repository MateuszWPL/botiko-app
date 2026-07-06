/**
 * Contrast helpers for the widget live-preview in the dashboard.
 *
 * Mirrors `onPrimary()` from apps/widget (YIQ luminance) so the settings preview
 * shows exactly what the embedded widget renders — most importantly a readable
 * foreground when the tenant picks a light accent (e.g. white), instead of the
 * previously hardcoded white text that vanished on light backgrounds.
 */

/** Readable foreground (near-black or white) for text/icons on a hex background. */
export function onPrimary(hex: string): string {
  const c = hex.replace('#', '');
  if (c.length < 6) return '#fff';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return '#fff';
  // YIQ ≥ 140 → light background → dark text; else white.
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#0f172a' : '#fff';
}

/**
 * Translucent backdrop + border for the avatar/logo circle sitting on the
 * accent header. On a dark accent it stays a frosted white; on a light accent
 * it flips to a subtle dark tint so an uploaded logo (or the letter fallback)
 * never disappears into a same-colour background.
 */
export function avatarBackdrop(hex: string): { bg: string; border: string } {
  return onPrimary(hex) === '#fff'
    ? { bg: 'rgba(255,255,255,0.2)', border: 'rgba(255,255,255,0.3)' }
    : { bg: 'rgba(0,0,0,0.08)', border: 'rgba(0,0,0,0.15)' };
}
