import { fireEvent, render } from '@testing-library/react-native';

import App from '../../App';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

describe('app shell', () => {
  it('renders the app and the registered screen', async () => {
    const { getByText, getByTestId } = await render(<App />);

    expect(getByText('Trinkgeld-Rechner')).toBeTruthy();
    expect(getByTestId('bill-amount-input')).toBeTruthy();
  });

  it('updates the bill-amount input text as the user types', async () => {
    const { getByTestId } = await render(<App />);
    const input = getByTestId('bill-amount-input');

    await fireEvent.changeText(input, '12,50');

    expect(getByTestId('bill-amount-input').props.value).toBe('12,50');
  });
});
