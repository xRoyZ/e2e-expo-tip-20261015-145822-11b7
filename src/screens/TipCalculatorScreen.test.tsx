import { fireEvent, render } from '@testing-library/react-native';

import TipCalculatorScreen from './TipCalculatorScreen';
import { calculateTip, formatCents } from '../lib/tip';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('../lib/tip');

const mockedCalculateTip = calculateTip as jest.MockedFunction<typeof calculateTip>;
const mockedFormatCents = formatCents as jest.MockedFunction<typeof formatCents>;

/** Mirrors the shared contract: whole cents -> two-decimal Euro string. */
function euro(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100);
  const rest = (abs % 100).toString().padStart(2, '0');
  return `${sign}${whole},${rest} €`;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedFormatCents.mockImplementation(euro);
});

describe('TipCalculatorScreen', () => {
  it('starts neutral: neither result nor error, hint in their place', async () => {
    const { getByTestId, getByText, queryByTestId } = await render(<TipCalculatorScreen />);

    expect(getByText('Bitte Rechnungsbetrag eingeben.')).toBeTruthy();
    expect(getByTestId('empty-state')).toBeTruthy();
    expect(queryByTestId('result-card')).toBeNull();
    expect(queryByTestId('error-message')).toBeNull();
    expect(mockedCalculateTip).not.toHaveBeenCalled();
  });

  it('shows the three result values and no error for valid inputs', async () => {
    mockedCalculateTip.mockReturnValue({
      ok: true,
      tipCents: 250,
      totalCents: 1250,
      perPersonCents: 625,
    });

    const { getByTestId, getByText, queryByTestId } = await render(<TipCalculatorScreen />);

    await fireEvent.changeText(getByTestId('bill-amount-input'), '10');
    await fireEvent.changeText(getByTestId('tip-percent-input'), '25');
    await fireEvent.changeText(getByTestId('people-input'), '2');

    expect(getByTestId('result-card')).toBeTruthy();
    expect(getByText('Trinkgeld')).toBeTruthy();
    expect(getByText('Gesamtbetrag')).toBeTruthy();
    expect(getByText('Betrag pro Person')).toBeTruthy();
    expect(getByTestId('result-tip').props.children).toBe('2,50 €');
    expect(getByTestId('result-total').props.children).toBe('12,50 €');
    expect(getByTestId('result-per-person').props.children).toBe('6,25 €');
    expect(queryByTestId('error-message')).toBeNull();
    expect(queryByTestId('empty-state')).toBeNull();
  });

  it('recalculates and re-renders live on every keystroke, without a button', async () => {
    mockedCalculateTip
      .mockReturnValueOnce({ ok: true, tipCents: 100, totalCents: 1100, perPersonCents: 1100 })
      .mockReturnValueOnce({ ok: true, tipCents: 200, totalCents: 2200, perPersonCents: 2200 });

    const { getByTestId, getByText, queryByText } = await render(<TipCalculatorScreen />);

    await fireEvent.changeText(getByTestId('bill-amount-input'), '10');
    expect(getByTestId('result-tip').props.children).toBe('1,00 €');

    await fireEvent.changeText(getByTestId('bill-amount-input'), '20');
    expect(getByTestId('result-tip').props.children).toBe('2,00 €');
    expect(queryByText('1,00 €')).toBeNull();
  });

  it('shows the German error message and no result values for invalid inputs', async () => {
    mockedCalculateTip.mockReturnValue({
      ok: false,
      error: 'Die Personenzahl muss eine ganze Zahl ab 1 sein.',
    });

    const { getByTestId, getByText, queryByTestId, queryByText } = await render(
      <TipCalculatorScreen />,
    );

    await fireEvent.changeText(getByTestId('people-input'), '0');

    expect(getByTestId('error-message')).toBeTruthy();
    expect(getByText('Die Personenzahl muss eine ganze Zahl ab 1 sein.')).toBeTruthy();
    expect(queryByTestId('result-card')).toBeNull();
    expect(queryByText('Gesamtbetrag')).toBeNull();
  });

  it('passes comma and point input through identically as typed', async () => {
    mockedCalculateTip.mockReturnValue({
      ok: true,
      tipCents: 1250,
      totalCents: 1250,
      perPersonCents: 1250,
    });

    const { getByTestId } = await render(<TipCalculatorScreen />);
    const billInput = getByTestId('bill-amount-input');

    await fireEvent.changeText(billInput, '12,50');
    await fireEvent.changeText(billInput, '12.50');

    expect(mockedCalculateTip).toHaveBeenNthCalledWith(1, '12,50', '', '');
    expect(mockedCalculateTip).toHaveBeenNthCalledWith(2, '12.50', '', '');
    expect(getByTestId('result-tip').props.children).toBe('12,50 €');
  });
});
