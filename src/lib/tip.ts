/**
 * Pure tip calculation — no React, no UI imports.
 *
 * This module is the shared interface the screen and the feature tickets build
 * against. The signatures below are final; the bodies are still inert and are
 * implemented by the tip-calculation ticket.
 */

export type TipResult =
  | { ok: true; tipCents: number; totalCents: number; perPersonCents: number }
  | { ok: false; error: string };

/**
 * Takes the raw text exactly as typed (comma or point as decimal separator) and
 * returns whole cents, rounded half-up, or a German user-facing error message.
 */
export function calculateTip(
  _billText: string,
  _tipPercentText: string,
  _peopleText: string,
): TipResult {
  return { ok: false, error: 'Die Berechnung ist noch nicht verfügbar.' };
}

/**
 * Turns whole cents into the two-decimal Euro string the screen shows.
 */
export function formatCents(_cents: number): string {
  return '';
}
