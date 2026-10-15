# Trinkgeld-Rechner

Eine kleine Mobile-App für iPhone und Android auf Basis von Expo (React Native,
TypeScript) mit genau einem Bildschirm. Der Nutzer gibt Rechnungsbetrag,
Trinkgeld-Prozent und Personenzahl ein und sieht sofort Trinkgeld, Gesamtbetrag
und Betrag pro Person — kaufmännisch auf ganze Cent gerundet und in Euro mit zwei
Nachkommastellen angezeigt. Ungültige Eingaben führen zu einer verständlichen
deutschen Fehlermeldung statt zu einem Ergebnis. Die App arbeitet vollständig
offline, ohne Backend und ohne gespeicherte Daten.

## Tech Stack

- **Sprache**: TypeScript (strikt)
- **Framework**: Expo / React Native (Expo SDK 57)
- **Tests**: Jest mit dem `jest-expo`-Preset und `@testing-library/react-native`
- **Web-Build**: `expo export --platform web` (Ausgabe in `dist/`)

## Voraussetzungen

- Node.js 22 und npm
- Für ein echtes Gerät: die Expo Go App (iOS/Android) oder ein Simulator/Emulator
- Für den Web-Build: keine weiteren Abhängigkeiten

## Installation

```bash
npm install
```

(Die CI und der Runner installieren reproduzierbar mit `npm ci`.)

## Entwicklung starten

Den Entwicklungsserver starten und den QR-Code mit Expo Go scannen bzw. im
Simulator/Emulator öffnen:

```bash
npm start
```

Danach im angezeigten Expo-Terminal `i` für den iOS-Simulator oder `a` für den
Android-Emulator drücken. Alternativ direkt:

```bash
npm run ios
npm run android
```

Hinweis: `npm start`, `npm run ios`, `npm run android` und `npm run web` starten
einen Entwicklungsserver, der nicht von selbst endet. Für einen einmaligen
Web-Build stattdessen `npm run build` verwenden.

## Web-Build für Produktion

```bash
npm run build
```

Der exportierte statische Web-Build landet in `dist/`. Zum lokalen Ansehen
(z. B. mit Python) einen statischen Server über das Verzeichnis starten:

```bash
python -m http.server 8000 --directory dist
```

und `http://localhost:8000` im Browser öffnen.

## Tests

```bash
npm test
```

Führt die Jest-Tests aus (u. a. die Shell-Tests unter `src/__tests__/`).

## Verwendung

Die App hat einen einzigen Bildschirm:

- **Rechnungsbetrag** — der Rechnungsbetrag in Euro; Komma oder Punkt sind als
  Dezimaltrenner erlaubt (z. B. `12,50` oder `12.50`).
- **Trinkgeld in Prozent** — der Trinkgeld-Satz (0–100 %).
- **Personenzahl** — die Anzahl der Personen (ganze Zahl ab 1).

Jede Änderung an einem Feld aktualisiert die Ergebnisse sofort, ohne
zusätzlichen Button. Angezeigt werden **Trinkgeld**, **Gesamtbetrag** und
**Betrag pro Person**, jeweils auf ganze Cent gerundet und mit zwei
Nachkommastellen als Euro-Betrag (z. B. `12,34 €`).

Ein unberührtes Feld startet neutral. Eine Fehlermeldung erscheint erst, nachdem
in ein Feld getippt wurde, und nur für das betroffene Feld. Bei ungültigen
Eingaben wird kein Ergebnis angezeigt.

## Features

- Eingabe von Rechnungsbetrag, Trinkgeld-Prozent und Personenzahl
- Sofortige Berechnung von Trinkgeld, Gesamtbetrag und Betrag pro Person
- Kaufmännische Rundung auf ganze Cent, Anzeige mit zwei Nachkommastellen in Euro
- Komma und Punkt als Dezimaltrenner werden gleich behandelt
- Deutsche, feldbezogene Fehlermeldungen bei ungültigen Eingaben
- Neutraler Start unberührter Felder (keine Fehlermeldung ohne Eingabe)
- Läuft auf iOS, Android und im Web-Build
