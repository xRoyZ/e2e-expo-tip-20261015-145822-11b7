# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Calm, uncluttered "single-purpose utility" look: warm off-white canvas, one deep green accent reserved for the result card, large tabular result figures — closer to a well-made iOS calculator than to a dashboard.

## Colors

- `--color-bg`: **#F7F5F1**
- `--color-surface`: **#FFFFFF**
- `--color-fg`: **#1C1B19**
- `--color-fg-muted`: **#6B6862**
- `--color-accent`: **#1F6F4A**
- `--color-accent-strong`: **#175538**
- `--color-accent-soft`: **#E7F1EB**
- `--color-border`: **#E2DED6**
- `--color-input-bg`: **#FFFFFF**
- `--color-danger`: **#B3261E**
- `--color-danger-soft`: **#FBEAE8**
- `--color-disabled`: **#A8A49C**

## Typography

- `font_family`: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- `font_family_numeric`: ui-monospace, 'SF Mono', 'Roboto Mono', Menlo, monospace (only for the three result figures, tabular-nums)
- `heading_weight`: 600
- `body_weight`: 400
- `size_scale`: 13px label, 15px body, 17px input, 22px section, 28px heading, 40px result figure

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Screen

bg=#F7F5F1. SafeAreaView, content container max-width 480px, horizontally centered, padding 24px left/right, 32px top. Vertical single scroll column (ScrollView) — never clips on small phones or with the keyboard open. Sections stacked with 24px gaps.

### ScreenTitle

'Trinkgeld-Rechner'. 28px, weight 600, color=fg, margin-bottom 24px. Single line.

### FieldLabel

13px, weight 600, letter-spacing 0.4px, color=fg-muted, uppercase optional off — plain sentence case. margin-bottom 8px. Text examples the product shows: 'Rechnungsbetrag', 'Trinkgeld in Prozent', 'Personenzahl'.

### Input

TextInput. height 48px (>=44px tap target), padding 12px/16px, radius md (10px), bg=#FFFFFF, border 1px #E2DED6, text 17px color=fg. keyboardType: 'decimal-pad' for Betrag and Prozent, 'number-pad' for Personenzahl. Accepts ',' and '.' as decimal separator (parsing rule, not visual). Focus: border 2px accent (#1F6F4A), subtle 2px accent-soft ring. Filled-valid: border #E2DED6. Error: border 2px #B3261E, bg #FBEAE8, text #B3261E, error message directly below (13px, #B3261E, margin-top 4px) with the German message, not a tooltip. Untouched initial state: neutral, no error, no success hint. Disabled: bg #F7F5F1, text #A8A49C.

### InputRow (QuickTipChips)

Optional row of percentage shortcuts under the Trinkgeld input: pills '10 %', '15 %', '20 %'. height 36px, padding 8px/16px, radius pill, bg=accent-soft, text 15px accent, selected bg=accent text #FFFFFF. Only ship these if they actually set the percentage value (AC-10); otherwise omit — do not render decorative non-functional controls.

### ResultCard

The one accent surface: bg=#1F6F4A, radius lg (16px), padding 24px, margin-top 32px, subtle shadow (0 2px 8px rgba(28,27,25,0.08)). Contains three result rows. Replaces nothing else on screen and only renders when the inputs are valid — when invalid, it is absent entirely (never shows dashes or stale numbers).

### ResultRow

Inside ResultCard. Label 13px, color rgba(255,255,255,0.78), margin-bottom 4px. Value 40px, weight 600, color #FFFFFF, font_family_numeric with tabular-nums, letter-spacing -0.5px. Rows 'Trinkgeld', 'Gesamtbetrag', 'Betrag pro Person'. Separated by 1px rgba(255,255,255,0.18) dividers, 16px vertical padding between rows. 'Betrag pro Person' is visually strongest (last row, same size, but preceded by a slightly thicker divider).

### EmptyState / Hint

Shown where the ResultCard would be while the form is pristine or incomplete: 15px, color fg-muted, centered, e.g. 'Bitte Rechnungsbetrag eingeben.' No placeholder numbers and no zeros — never imply a result that is not computed.

### ErrorMessage

Inline, directly under the offending field. 13px, weight 400, color #B3261E, margin-top 4px, prefixed with '⚠ '. One message per invalid field, German and concrete (e.g. 'Bitte einen gültigen Betrag eingeben.', 'Der Trinkgeld-Prozentsatz muss zwischen 0 und 100 liegen.', 'Die Personenzahl muss eine ganze Zahl ab 1 sein.'). Presented as Text only — user input is never rendered as markup anywhere (AC-11).

### Button

Secondary, seldom used (e.g. a 'Zurücksetzen' reset). height 48px (>=44px), padding 12px/24px, radius md (10px), weight 600, 17px. default: bg=#FFFFFF, border 1px #E2DED6, text fg. hover (web): bg=#F2EFE9, border #D6D1C7. active/pressed: bg=#E9E5DE, translateY 1px. focus-visible: 2px accent ring offset 2px. disabled: bg=#F7F5F1, border #E2DED6, text #A8A49C, no shadow. PrimaryButton variant (if a confirm affordance is ever added; the core flow needs none): bg=#1F6F4A, text #FFFFFF, hover bg=#175538, active #123F29, disabled opacity 0.5. Every visible control does what its label says, or is not rendered at all (AC-10) — no disabled teaser buttons.

### KeyboardAvoidingView

Behavior 'padding' on iOS, 'height' on Android; the ResultCard and focused Input stay visible above the keyboard. Vertical scroll as fallback.

## Layout Principles

- Single screen only — no navigation, no tabs, no modals (per spec and Design Directives). One column, everything reachable without a second page.
- Container max-width 480px, horizontally centered; padding 24px horizontal, 32px top, 24px bottom. Phone viewport (360–430px wide) renders without horizontal or vertical overflow.
- Breakpoints: <480px = full-width single column (the only real case for this mobile app); >=480px (web preview) = same column, centered with 24px gutters. No multi-column layout at any width.
- Vertical rhythm from the spacing scale only: 4/8/12/16/24/32/48. 24px between form fields, 32px between the form block and the result block, 16px inside the result card between rows.
- Order top-to-bottom: title → three inputs with labels (and per-field error text) → results/hint → optional reset button. Results never jump above the inputs.
- Number formatting — ONE format everywhere, for every date, time, duration and amount the product shows: amounts in German locale with comma as decimal separator, always exactly two decimals, followed by a space and the Euro sign — e.g. '12,34 €', '0,00 €', '1.234,56 €' (thousands separator '.' ), '99,90 €'. Rounding: commercial rounding (round half away from zero) to whole cents, then format — never show raw floating point. Percentages: integer or decimal with comma plus a space, e.g. '15 %', '12,5 %'. Person count: plain integer, e.g. '3'. All figures rendered with tabular-nums so values do not jitter as the user types.
- Result figures are the visual hierarchy peak: 40px, weight 600, white on the green accent card. Inputs and labels stay quiet (neutral surfaces, muted labels). Exactly one accent surface on screen.
- Color discipline: bg #F7F5F1 and surfaces #FFFFFF carry everything; accent #1F6F4A marks only the result card and focus rings; danger #B3261E is used only for invalid input borders and error text, never decoratively.
- Readability over any state: body text #1C1B19 on #F7F5F1 gives >12:1 contrast; white on #1F6F4A gives ~6.9:1 — both comfortably above WCAG AA. Never place muted #6B6862 text on the accent green.
- Empty/error states are content, not decoration: when a value cannot be computed the result card is absent and a plain-language hint or the German error message takes its place — no '0,00 €' placeholders, no spinner, no fake loading (AC-05, AC-06, AC-12).
- Motion: none beyond a 120ms ease-out on the focus ring and result-card appearance. No bouncing, no animated numbers — the figures just update instantly on every keystroke.
