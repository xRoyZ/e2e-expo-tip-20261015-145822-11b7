/**
 * Pure tip calculation — no React, no UI imports.
 *
 * This module is the shared interface the screen and the feature tickets build
 * against. `calculateTip` takes the raw text exactly as typed (a comma and a
 * point are treated alike as the decimal separator, AC-09) and returns whole
 * cents rounded half-up, or a German user-facing error message that the screen
 * renders verbatim. Non-finite values (NaN, Infinity, overflow through extreme
 * input such as `1e308`) always end in `{ ok: false }` and never in a result
 * (AC-12).
 */

export type TipResult =
  | { ok: true; tipCents: number; totalCents: number; perPersonCents: number }
  | { ok: false; error: string };

type ParsedNumber =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'nonfinite' }
  | { kind: 'finite'; value: number };

type Validated = { error: string } | { value: number };

/** Matches an optionally signed decimal number with an optional exponent. */
const NUMERIC_PATTERN = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

/**
 * Parses a single field, distinguishing the reasons a text is not usable so
 * the caller can answer with a field-specific German message.
 */
function parseNumber(text: string): ParsedNumber {
  const trimmed = text.trim();
  if (trimmed === '') {
    return { kind: 'empty' };
  }

  const normalized = trimmed.replace(',', '.');
  if (!NUMERIC_PATTERN.test(normalized)) {
    return { kind: 'invalid' };
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return { kind: 'nonfinite' };
  }

  return { kind: 'finite', value };
}

/** Commercial rounding to whole cents; all inputs here are non-negative. */
function roundHalfUp(value: number): number {
  return Math.round(value);
}

const error = (message: string): TipResult => ({ ok: false, error: message });

/** Validates the raw bill text; bill ≥ 0 (AC-04, AC-05). */
function validateBill(text: string): Validated {
  const parsed = parseNumber(text);
  if (parsed.kind === 'empty') {
    return { error: 'Bitte Rechnungsbetrag eingeben.' };
  }
  if (parsed.kind === 'invalid') {
    return { error: 'Bitte einen gültigen Betrag eingeben.' };
  }
  if (parsed.kind === 'nonfinite') {
    return { error: 'Der Rechnungsbetrag ist zu groß.' };
  }
  if (parsed.value < 0) {
    return { error: 'Der Rechnungsbetrag darf nicht negativ sein.' };
  }
  return { value: parsed.value };
}

/** Validates the raw tip text; 0–100 % (AC-04, AC-05). */
function validateTipPercent(text: string): Validated {
  const parsed = parseNumber(text);
  if (parsed.kind === 'empty') {
    return { error: 'Bitte Trinkgeld in Prozent eingeben.' };
  }
  if (parsed.kind === 'invalid') {
    return { error: 'Bitte einen gültigen Trinkgeld-Prozentsatz eingeben.' };
  }
  if (parsed.kind === 'nonfinite') {
    return { error: 'Der Trinkgeld-Prozentsatz ist zu groß.' };
  }
  if (parsed.value < 0 || parsed.value > 100) {
    return { error: 'Der Trinkgeld-Prozentsatz muss zwischen 0 und 100 liegen.' };
  }
  return { value: parsed.value };
}

/** Validates the raw people text; an integer ≥ 1 (AC-04, AC-05). */
function validatePeople(text: string): Validated {
  const parsed = parseNumber(text);
  if (parsed.kind === 'empty') {
    return { error: 'Bitte Personenzahl eingeben.' };
  }
  if (parsed.kind === 'invalid') {
    return { error: 'Bitte eine gültige Personenzahl eingeben.' };
  }
  if (parsed.kind === 'nonfinite') {
    return { error: 'Die Personenzahl ist zu groß.' };
  }
  if (parsed.value < 1 || !Number.isInteger(parsed.value)) {
    return { error: 'Die Personenzahl muss eine ganze Zahl ab 1 sein.' };
  }
  return { value: parsed.value };
}

/**
 * Converts the validated euros into whole cents, rounded half-up, guarding
 * every intermediate against overflow (AC-03, AC-12).
 */
function computeCents(
  bill: number,
  tipPercent: number,
  people: number,
): TipResult {
  const billCentsExact = bill * 100;
  if (!Number.isFinite(billCentsExact)) {
    return error('Der Rechnungsbetrag ist zu groß.');
  }

  const billCents = roundHalfUp(billCentsExact);
  const tipCents = roundHalfUp((billCentsExact * tipPercent) / 100);
  const totalCents = billCents + tipCents;
  const perPersonCents = roundHalfUp(totalCents / people);

  if (
    !Number.isFinite(tipCents) ||
    !Number.isFinite(totalCents) ||
    !Number.isFinite(perPersonCents)
  ) {
    return error('Die eingegebenen Werte sind zu groß.');
  }

  return { ok: true, tipCents, totalCents, perPersonCents };
}

/**
 * Takes the raw text exactly as typed (comma or point as decimal separator) and
 * returns whole cents, rounded half-up, or a German user-facing error message.
 */
export function calculateTip(
  billText: string,
  tipPercentText: string,
  peopleText: string,
): TipResult {
  const bill = validateBill(billText);
  if ('error' in bill) {
    return error(bill.error);
  }

  const tipPercent = validateTipPercent(tipPercentText);
  if ('error' in tipPercent) {
    return error(tipPercent.error);
  }

  const people = validatePeople(peopleText);
  if ('error' in people) {
    return error(people.error);
  }

  return computeCents(bill.value, tipPercent.value, people.value);
}

/** Inserts a '.' every three digits, e.g. `1234` -> `1.234`. */
function groupThousands(value: number): string {
  const digits = String(value);
  let grouped = '';
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) {
      grouped += '.';
    }
    grouped += digits[i];
  }
  return grouped;
}

/**
 * Turns whole cents into the two-decimal Euro string the screen shows,
 * German locale: comma decimal separator, '.' thousands separator and a
 * trailing ' €' — e.g. `1234` -> '12,34 €', `123456` -> '1.234,56 €'.
 */
export function formatCents(cents: number): string {
  const rounded = Math.round(cents);
  const sign = rounded < 0 ? '-' : '';
  const absolute = Math.abs(rounded);
  const euros = groupThousands(Math.floor(absolute / 100));
  const rest = String(absolute % 100).padStart(2, '0');
  return `${sign}${euros},${rest} €`;
}
