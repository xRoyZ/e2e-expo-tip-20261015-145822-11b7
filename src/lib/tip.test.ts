import { calculateTip, formatCents } from './tip';

describe('calculateTip — valid cases', () => {
  it('computes tip, total and per person for a plain case', () => {
    expect(calculateTip('10', '15', '3')).toEqual({
      ok: true,
      tipCents: 150,
      totalCents: 1150,
      perPersonCents: 383,
    });
  });

  it('accepts zero tip and a single person', () => {
    expect(calculateTip('10', '0', '1')).toEqual({
      ok: true,
      tipCents: 0,
      totalCents: 1000,
      perPersonCents: 1000,
    });
  });

  it('accepts a zero bill', () => {
    expect(calculateTip('0', '20', '2')).toEqual({
      ok: true,
      tipCents: 0,
      totalCents: 0,
      perPersonCents: 0,
    });
  });

  it('accepts a decimal point percentage', () => {
    expect(calculateTip('20', '12.5', '2')).toEqual({
      ok: true,
      tipCents: 250,
      totalCents: 2250,
      perPersonCents: 1125,
    });
  });
});

describe('calculateTip — cent rounding (half-up)', () => {
  it('rounds a half cent up for the tip', () => {
    // 0.01 € * 50 % = 0.005 € = 0.5 cents -> 1 cent half-up.
    expect(calculateTip('0,01', '50', '1')).toEqual({
      ok: true,
      tipCents: 1,
      totalCents: 2,
      perPersonCents: 2,
    });
  });

  it('rounds the per-person share half-up', () => {
    // total 1150 cents / 3 = 383.33... -> 383.
    const result = calculateTip('10', '15', '3');
    expect(result.ok && result.perPersonCents).toBe(383);
  });

  it('rounds a repeating share up when it lands on a half', () => {
    // 10,05 € with 0 tip over 2 people = 502.5 cents -> 503.
    expect(calculateTip('10,05', '0', '2')).toEqual({
      ok: true,
      tipCents: 0,
      totalCents: 1005,
      perPersonCents: 503,
    });
  });
});

describe('calculateTip — comma and point are equivalent (AC-09)', () => {
  it('treats "10,50" and "10.50" the same', () => {
    expect(calculateTip('10,50', '10', '2')).toEqual(
      calculateTip('10.50', '10', '2'),
    );
  });

  it('treats "12,5" and "12.5" the same', () => {
    expect(calculateTip('20', '12,5', '2')).toEqual(
      calculateTip('20', '12.5', '2'),
    );
  });
});

describe('calculateTip — invalid input (AC-05)', () => {
  it('rejects empty fields with a German message', () => {
    const result = calculateTip('', '', '');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/[A-Za-zÄÖÜäöü]/);
    }
  });

  it('rejects a non-numeric bill', () => {
    expect(calculateTip('abc', '10', '1')).toEqual({
      ok: false,
      error: 'Bitte einen gültigen Betrag eingeben.',
    });
  });

  it('rejects a negative bill', () => {
    expect(calculateTip('-5', '10', '1')).toEqual({
      ok: false,
      error: 'Der Rechnungsbetrag darf nicht negativ sein.',
    });
  });

  it('rejects a tip above 100 percent', () => {
    expect(calculateTip('10', '150', '1')).toEqual({
      ok: false,
      error: 'Der Trinkgeld-Prozentsatz muss zwischen 0 und 100 liegen.',
    });
  });

  it('rejects a negative tip', () => {
    expect(calculateTip('10', '-5', '1')).toEqual({
      ok: false,
      error: 'Der Trinkgeld-Prozentsatz muss zwischen 0 und 100 liegen.',
    });
  });

  it('rejects a non-numeric tip', () => {
    const result = calculateTip('10', 'abc', '1');
    expect(result.ok).toBe(false);
  });

  it('rejects people below 1', () => {
    expect(calculateTip('10', '10', '0')).toEqual({
      ok: false,
      error: 'Die Personenzahl muss eine ganze Zahl ab 1 sein.',
    });
  });

  it('rejects a non-integer number of people', () => {
    expect(calculateTip('10', '10', '2,5')).toEqual({
      ok: false,
      error: 'Die Personenzahl muss eine ganze Zahl ab 1 sein.',
    });
  });

  it('rejects a non-numeric number of people', () => {
    const result = calculateTip('10', '10', 'many');
    expect(result.ok).toBe(false);
  });
});

describe('calculateTip — non-finite values (AC-12)', () => {
  it('rejects overflow through an extreme bill such as 1e308', () => {
    const result = calculateTip('1e308', '10', '1');
    expect(result.ok).toBe(false);
  });

  it('rejects NaN and Infinity literals', () => {
    expect(calculateTip('NaN', '10', '1').ok).toBe(false);
    expect(calculateTip('Infinity', '10', '1').ok).toBe(false);
  });

  it('never returns a result for an extreme input', () => {
    const result = calculateTip('1e308', '10', '1');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(typeof result.error).toBe('string');
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});

describe('formatCents', () => {
  it('formats whole cents with a comma and two decimals', () => {
    expect(formatCents(1234)).toBe('12,34 €');
    expect(formatCents(0)).toBe('0,00 €');
    expect(formatCents(9990)).toBe('99,90 €');
    expect(formatCents(5)).toBe('0,05 €');
  });

  it('uses a dot as the thousands separator', () => {
    expect(formatCents(123456)).toBe('1.234,56 €');
    expect(formatCents(100000000)).toBe('1.000.000,00 €');
  });
});
