# Road Overview – E2E-Tests (Serenity/JS + Playwright + Cucumber)

Automatisierte End-to-End-Tests für die „Road Overview"-Web-App (Schritt 6,
Bonus). Umgesetzt mit **Serenity/JS** im **Screenplay-Pattern**, als
Browser-Engine läuft **Playwright**, die Szenarien sind in **Gherkin**
(Cucumber) geschrieben.

## Warum Serenity/JS (und nicht Serenity BDD für Java)?

Das gesamte System-under-Test ist TypeScript/Node (React-Frontend, json-server,
Postman/Newman-API-Tests). Serenity/JS bleibt in genau dieser Toolchain – ein
`npm install`, kein zweiter JVM-/Maven-Stack daneben – erfüllt den in der
Aufgabe genannten Playwright-Hinweis (Serenity/JS *wrappt* Playwright) und
liefert trotzdem die Serenity *Living-Documentation*-Reports. Für die
HTML-Reportgenerierung wird einmalig die Serenity-BDD-CLI (ein Java-Tool)
verwendet – die Tests selbst laufen auf Node.

## Voraussetzungen

| | |
|---|---|
| **Node.js** | **22 oder 24** (Cucumber 13 lehnt 20/25 ab). Lokal getestet mit Node 24.21. |
| **Java (JRE/JDK)** | nur für die Report-Generierung (Serenity-BDD-CLI). Getestet mit OpenJDK 23. |
| **laufendes SUT** | Web-App `:5173` + API `:3000` (siehe unten). |

## Installation

```bash
cd e2e-tests
npm install
npx playwright install chromium   # Browser-Binary
npx serenity-bdd update           # Serenity-BDD-CLI (Java-Jar) einmalig laden
```

## SUT starten

Die Tests gehen von einer **laufenden** Anwendung aus (sie booten sie nicht
selbst):

```bash
cd ../sut
docker compose up --build         # API :3000 + Frontend :5173
```

`npm test` prüft per `pretest`-Hook vorab, ob beide Ports erreichbar sind, und
bricht sonst mit einer klaren Meldung ab.

## Ausführen

```bash
# Komplette Suite + Serenity-Report (target/site/serenity/index.html)
npm test

# Nur die fachlichen Happy-Paths (grünes Gate, ohne die bewussten Defekt-Reds)
npx cucumber-js --tags "not @defect"

# Nur die dokumentierten Defekte
npx cucumber-js --tags "@defect"

# Browser sichtbar mitlaufen lassen
HEADLESS=false npx cucumber-js --tags "not @defect"
```

URLs pro Lauf überschreibbar:

```bash
BASE_URL=http://127.0.0.1:5173 API_URL=http://127.0.0.1:3000 npm test
```

## Abgedeckte User Flows (mit Traceability zu Abschnitt 4)

| Feature | Flow | Anforderung |
|---|---|---|
| `add-todo.feature` | Straße auf der Karte klicken → Modal → Maßnahme erfassen → per `POST /todos` persistiert; gegen API **und** Todos-Tabelle verifiziert | Req. 7 |
| `map-evaluation.feature` | Bewertung im Dropdown wählen, Straßenfarben liegen in der Grade-Palette, Legende vorhanden | Req. 3, 4 |
| `navigation.feature` | Navbar-Links öffnen Karte/Overview/Statistics/Todos | Req. 8 |
| `statistics.feature` | Statistik-Seite: Chart, „Total Roads" = 773, **Average GW der UI == aus `/roads` nachgerechnet** | Req. 6 |

## Bewusst rote Szenarien (`@defect`)

Diese Szenarien prüfen das **Soll laut Anforderung** und scheitern daher
absichtlich – sie dokumentieren reale Funde direkt im Living-Doc-Report (rot,
mit Anforderungsbezug). `npm test` endet deshalb mit Exit-Code ≠ 0; für ein
grünes CI-Gate `--tags "not @defect"` nutzen.

| # | Szenario | Erwartet (Anforderung) | Tatsächlich | Bezug |
|---|---|---|---|---|
| 1 | Create-Button beschriftet | Bei neuer Maßnahme „Save" | „Update" (`selectedRoad ? 'Update' : 'Save'`, `selectedRoad` immer gesetzt) | Req. 7 |
| 2 | Titel bei Neuanlage eingebbar | Titel ist Eingabefeld | Feld mit Straßennamen vorbelegt **und disabled** | Req. 7 |
| 3 | RISS auswählbar | RISS im Dropdown (Req. 3 nennt RISS explizit; Daten liegen unter `eemi_grade.sub_type_grades.RISS`) | Nur GW/TWGEB/TWOFS/TWRIO/TWSUB/TWEBEN | Req. 3 |

## Projektstruktur

```
e2e-tests/
├── features/                     # Gherkin-Szenarien (.feature)
│   ├── add-todo.feature
│   ├── map-evaluation.feature
│   ├── navigation.feature
│   ├── statistics.feature
│   ├── step_definitions/         # Steps → Screenplay-Tasks/Questions
│   └── support/                  # Serenity-Setup, Cucumber-Hooks (Cleanup)
├── src/
│   ├── Actors.ts                 # Cast: BrowseTheWeb (Playwright) + CallAnApi (REST)
│   ├── config.ts                 # baseURL / apiURL (env-überschreibbar)
│   ├── api.ts                    # REST-Helper für Cleanup + API-Gegencheck
│   └── screenplay/               # PageElements, Tasks, Questions (map/modal/pages)
├── scripts/
│   ├── check-sut.js              # Fail-fast, wenn SUT nicht läuft
│   └── probe.ts                  # Explorations-Skript (npm run probe) – kein Test
├── cucumber.cjs                  # Cucumber-Profil (ts-node, Serenity-Formatter)
└── package.json
```

### Design-Notizen

- **Idempotent & self-cleaning:** Vor/Nach den `@todos`-Szenarien werden alle
  Todos von Straße `fid 1307` per API entfernt (wie die Newman-Suite), damit
  der Klick garantiert eine **neue** Maßnahme anlegt (`POST`, nicht `PUT`).
- **Leaflet-Klick:** Straßen sind SVG-`<path>`-Elemente; Playwrights
  Standard-Actionability scheitert daran, deshalb ein gezielter Force-Click
  über die native Page (siehe `RoadMap.clickRoad`).
- **Farbprüfung:** Gegen die vom Browser berechneten `rgb(...)`-Stroke-Werte
  der Grade-Palette.

## Bekannte Einschränkungen

- Kartenkacheln laden live von OpenStreetMap → Browser braucht Internet (die
  Straßengeometrie rendert auch offline).
- Der Chart-Re-Render-Bug (`new Chart` ohne `destroy`) ist per E2E nicht
  deterministisch reproduzierbar und daher nicht als `@defect` kodiert – er
  gehört in die Code-Review-/Explorativ-Funde.

## KI-Einsatz (Transparenz, Abschnitt 6)

Diese Test-Suite wurde mit **Claude Code** erstellt. Vorgehen: der echte
DOM/das Verhalten der laufenden App wurde zuerst mit einem Playwright-Probe
(`scripts/probe.ts`) empirisch erkundet (Klick-Methode für Leaflet-Pfade,
Selektoren, Stroke-Farbformat, Navigationsziele); darauf aufbauend wurden die
Screenplay-Bausteine und Gherkin-Szenarien geschrieben und iterativ grün bzw.
– für die Defekte – bewusst rot verifiziert.
```
