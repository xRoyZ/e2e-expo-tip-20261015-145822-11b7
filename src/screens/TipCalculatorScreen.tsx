import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, radii, spacing, typography } from '../theme';

/**
 * The single screen of the app.
 *
 * This is a scaffold stub: it renders the bill-amount input for real (its label,
 * its testID and a controlled value that updates as the user types) and leaves
 * the remaining fields and the result card to the screen feature ticket.
 */
export default function TipCalculatorScreen(): React.JSX.Element {
  const [billText, setBillText] = useState('');
  const [billFocused, setBillFocused] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Trinkgeld-Rechner</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Rechnungsbetrag</Text>
          <TextInput
            style={[styles.input, billFocused ? styles.inputFocused : null]}
            value={billText}
            onChangeText={setBillText}
            onFocus={() => setBillFocused(true)}
            onBlur={() => setBillFocused(false)}
            testID="bill-amount-input"
            accessibilityLabel="Rechnungsbetrag"
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={colors.fgMuted}
          />
        </View>

        <View style={styles.placeholder} testID="tip-screen-placeholder">
          <Text style={styles.placeholderText}>Bitte Rechnungsbetrag eingeben.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: spacing.space4,
    paddingTop: spacing.space5,
    paddingBottom: spacing.space4,
  },
  title: {
    fontFamily: fonts.family,
    fontSize: typography.heading,
    fontWeight: typography.headingWeight,
    color: colors.fg,
    marginBottom: spacing.space4,
  },
  field: {
    marginBottom: spacing.space4,
  },
  label: {
    fontFamily: fonts.family,
    fontSize: typography.label,
    fontWeight: typography.headingWeight,
    letterSpacing: typography.labelLetterSpacing,
    color: colors.fgMuted,
    marginBottom: spacing.space1,
  },
  input: {
    height: 48,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    fontFamily: fonts.family,
    fontSize: typography.input,
    color: colors.fg,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  placeholder: {
    marginTop: spacing.space5,
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: fonts.family,
    fontSize: typography.body,
    color: colors.fgMuted,
    textAlign: 'center',
  },
});
