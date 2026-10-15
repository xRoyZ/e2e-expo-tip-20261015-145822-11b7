import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TipCalculatorScreen from './src/screens/TipCalculatorScreen';

/**
 * App root: provides the safe-area context, waits for the typefaces to load and
 * registers the app's single screen.
 *
 * DESIGN.md uses the platform's system typefaces, so there are no font assets
 * to load here — the load gate stays in place for when a custom family is added.
 */
export default function App(): React.JSX.Element {
  const [fontsLoaded] = useFonts({});

  if (!fontsLoaded) {
    return <SafeAreaProvider />;
  }

  return (
    <SafeAreaProvider>
      <TipCalculatorScreen />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
