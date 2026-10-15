import { useMemo, useState } from 'react';
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { calculateTip, formatCents, TipResult } from '../lib/tip';
import { colors, fonts, radii, spacing, typography } from '../theme';

type FieldProps = {
  label: string;
  testID: string;
  value: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  isFocused: boolean;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
};

function Field({
  label,
  testID,
  value,
  placeholder,
  keyboardType,
  isFocused,
  onChangeText,
  onFocus,
  onBlur,
  onSubmit,
}: FieldProps): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused ? styles.inputFocused : null]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmit}
        testID={testID}
        accessibilityLabel={label}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.fgMuted}
      />
    </View>
  );
}

function ResultCard({ result }: { result: TipResult }): React.JSX.Element | null {
  if (!result.ok) {
    return null;
  }
  return (
    <View style={styles.resultCard} testID="result-card">
      <View style={[styles.resultRow, styles.resultRowFirst]}>
        <Text style={styles.resultLabel}>Trinkgeld</Text>
        <Text style={styles.resultValue} testID="result-tip">
          {formatCents(result.tipCents)}
        </Text>
      </View>
      <View style={styles.resultDivider} />
      <View style={styles.resultRow}>
        <Text style={styles.resultLabel}>Gesamtbetrag</Text>
        <Text style={styles.resultValue} testID="result-total">
          {formatCents(result.totalCents)}
        </Text>
      </View>
      <View style={styles.resultDividerStrong} />
      <View style={styles.resultRow}>
        <Text style={styles.resultLabel}>Betrag pro Person</Text>
        <Text style={styles.resultValue} testID="result-per-person">
          {formatCents(result.perPersonCents)}
        </Text>
      </View>
    </View>
  );
}

function ResultArea({ result }: { result: TipResult | null }): React.JSX.Element {
  if (result === null) {
    return (
      <View style={styles.hint} testID="empty-state">
        <Text style={styles.hintText}>Bitte Rechnungsbetrag eingeben.</Text>
      </View>
    );
  }
  if (result.ok) {
    return <ResultCard result={result} />;
  }
  return (
    <View style={styles.errorRow} testID="error-message">
      <Text style={styles.errorIcon}>⚠</Text>
      <Text style={styles.errorText}>{result.error}</Text>
    </View>
  );
}

/**
 * The single screen of the app.
 *
 * Holds the raw text of the three fields (bill, tip percent, people) and one
 * touched flag per field. Every result and the error come exclusively from
 * `calculateTip` / `formatCents`. While no field has been touched and nothing
 * has been submitted the screen is neutral: neither a result nor an error.
 */
export default function TipCalculatorScreen(): React.JSX.Element {
  const [billText, setBillText] = useState('');
  const [tipPercentText, setTipPercentText] = useState('');
  const [peopleText, setPeopleText] = useState('');
  const [touched, setTouched] = useState({ bill: false, tipPercent: false, people: false });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const interacted = touched.bill || touched.tipPercent || touched.people || submitted;
  const result = useMemo(
    () => (interacted ? calculateTip(billText, tipPercentText, peopleText) : null),
    [interacted, billText, tipPercentText, peopleText],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Trinkgeld-Rechner</Text>

        <Field
          label="Rechnungsbetrag"
          testID="bill-amount-input"
          value={billText}
          placeholder="0,00"
          keyboardType="decimal-pad"
          isFocused={focusedField === 'bill'}
          onChangeText={(text) => {
            setTouched((prev) => ({ ...prev, bill: true }));
            setBillText(text);
          }}
          onFocus={() => setFocusedField('bill')}
          onBlur={() => setFocusedField(null)}
          onSubmit={() => setSubmitted(true)}
        />
        <Field
          label="Trinkgeld in Prozent"
          testID="tip-percent-input"
          value={tipPercentText}
          placeholder="15"
          keyboardType="decimal-pad"
          isFocused={focusedField === 'tipPercent'}
          onChangeText={(text) => {
            setTouched((prev) => ({ ...prev, tipPercent: true }));
            setTipPercentText(text);
          }}
          onFocus={() => setFocusedField('tipPercent')}
          onBlur={() => setFocusedField(null)}
          onSubmit={() => setSubmitted(true)}
        />
        <Field
          label="Personenzahl"
          testID="people-input"
          value={peopleText}
          placeholder="1"
          keyboardType="number-pad"
          isFocused={focusedField === 'people'}
          onChangeText={(text) => {
            setTouched((prev) => ({ ...prev, people: true }));
            setPeopleText(text);
          }}
          onFocus={() => setFocusedField('people')}
          onBlur={() => setFocusedField(null)}
          onSubmit={() => setSubmitted(true)}
        />

        <ResultArea result={result} />
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
  hint: {
    marginTop: spacing.space5,
    alignItems: 'center',
  },
  hintText: {
    fontFamily: fonts.family,
    fontSize: typography.body,
    color: colors.fgMuted,
    textAlign: 'center',
  },
  resultCard: {
    marginTop: spacing.space5,
    padding: spacing.space4,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    shadowColor: '#1C1B19',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  resultRow: {
    paddingVertical: spacing.space3,
  },
  resultRowFirst: {
    paddingTop: spacing.space0,
  },
  resultLabel: {
    fontFamily: fonts.family,
    fontSize: typography.label,
    color: 'rgba(255,255,255,0.78)',
    marginBottom: spacing.space0,
  },
  resultValue: {
    fontFamily: fonts.numeric,
    fontSize: typography.resultFigure,
    fontWeight: typography.headingWeight,
    color: colors.surface,
    letterSpacing: typography.figureLetterSpacing,
    fontVariant: ['tabular-nums'],
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  resultDividerStrong: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.space5,
  },
  errorIcon: {
    fontFamily: fonts.family,
    fontSize: typography.label,
    color: colors.danger,
    marginRight: spacing.space0,
  },
  errorText: {
    flex: 1,
    fontFamily: fonts.family,
    fontSize: typography.label,
    color: colors.danger,
  },
});
