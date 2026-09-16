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

## Tags

Jedes Szenario trägt einen **Bereichs-Tag**, einen **Anforderungs-Tag** und
einen **Testfall-Tag** (TF-1 bis TF-3 aus der Präsentation, Abschnitt 2).
Tags über `Feature:` gelten für alle Szenarien der Datei, Tags über
`Examples:` nur für deren Zeilen.

| Tag | Bedeutung | Szenarien |
|---|---|---|
| `@todos` | Todos erfassen (`add-todo.feature`) – steuert zusätzlich den Cleanup-Hook in `features/support/hooks.ts`, daher nicht umbenennen | 5 |
| `@map` | Karte, Bewertung & Hover (`map-evaluation.feature`, `road-hover.feature`) | 10 |
| `@navigation` | Navigation (`navigation.feature`) | 3 |
| `@statistics` | Statistik-Seite (`statistics.feature`) | 4 |
| `@req-3` | Anforderung 3 – Straßen nach Bewertung einfärben | 7 |
| `@req-4` | Anforderung 4 – Legende | 1 |
| `@req-5` | Anforderung 5 – Hover-Effekt & Tooltip | 3 |
| `@req-6` | Anforderung 6 – Statistik | 4 |
| `@req-7` | Anforderung 7 – Todo anlegen und aktualisieren | 5 |
| `@req-8` | Anforderung 8 – Navigation | 3 |
| `@TF-1` | Testfall 1 – Straßenzustand nach Bewertungsart auf der Karte beurteilen (`map-evaluation.feature`, `road-hover.feature`) | 10 |
| `@TF-2` | Testfall 2 – Todos für Straßen verwalten (`add-todo.feature`, Navigation zu Todos) | 6 |
| `@TF-3` | Testfall 3 – Straßendaten sichten und analysieren (`statistics.feature`, Navigation zu Overview/Statistics) | 6 |
| `@defect` | bewusst rot, dokumentiert einen Defekt | 6 |
| `@issue:BUG-01` | Bug-ID aus der Bug-Liste, erscheint im Serenity-Report als Issue | 1 |

```bash
npx cucumber-js --tags "@map"
npx cucumber-js --tags "@req-7 and not @defect"
npx cucumber-js --tags "@statistics or @navigation"
npx cucumber-js --tags "@TF-2"
```

## Abgedeckte User Flows (mit Traceability zu Abschnitt 4)

| Feature | Flow | Anforderung | Testfall |
|---|---|---|---|
| `add-todo.feature` | Straße auf der Karte klicken → Modal → Maßnahme erfassen → per `POST /todos` persistiert; gegen API **und** Todos-Tabelle verifiziert | Req. 7 | TF-2 |
| `map-evaluation.feature` | Zwischen allen Bewertungen im Dropdown wechseln, Referenzstraße (fid 5646) hat nach jedem Wechsel die Farbe ihrer Note laut `/roads`; Legende vorhanden | Req. 3, 4 | TF-1 |
| `navigation.feature` | Navbar-Links öffnen Karte/Overview/Statistics/Todos | Req. 8 | TF-2, TF-3 |
| `statistics.feature` | Statistik-Seite: Chart, „Total Roads" = 773, **Average GW der UI == aus `/roads` nachgerechnet** | Req. 6 | TF-3 |
| `road-hover.feature` | Straße hovern → Tooltip mit Road ID, Name, EVNK, ENNK und Note, gegen `/roads` verifiziert; Tooltip und Straßenfarbe nach Wechsel der Bewertung | Req. 5 (3) | TF-1 |

## Bewusst rote Szenarien (`@defect`)

Diese Szenarien prüfen das **Soll laut Anforderung** und scheitern daher
absichtlich – sie dokumentieren reale Funde direkt im Living-Doc-Report (rot,
mit Anforderungsbezug). `npm test` endet deshalb mit Exit-Code ≠ 0; für ein
grünes CI-Gate `--tags "not @defect"` nutzen.

| # | Szenario | Erwartet (Anforderung) | Tatsächlich | Bezug |
|---|---|---|---|---|
| 1 | Create-Button beschriftet | Bei neuer Maßnahme „Save" | „Update" (`selectedRoad ? 'Update' : 'Save'`, `selectedRoad` immer gesetzt) | Req. 7 |
| 2 | Titel bei Neuanlage eingebbar | Titel ist Eingabefeld | Feld mit Straßennamen vorbelegt **und disabled** | Req. 7 |
| 3 | Hover-Tooltip zeigt die gewählte Bewertung (`@issue:BUG-01`) | Nach Wechsel auf TWOFS: `EEMI Grade (twofs): <Note>` | Immer `EEMI Grade (gw): …` – `<GeoJSON>` ohne `key={evaluation}`, die `onEachFeature`-Closure stammt vom ersten Render | Req. 5 |
| 4 | Straßenfarbe nach Hover | Straße bleibt nach TWOFS eingefärbt | `mouseout` färbt mit `getStyle` des ersten Renders → GW-Farbe; die Karte mischt zwei Bewertungen | Req. 5, 3 |
| 5 | Alle Todos einer Straße erreichbar | Blättern zwischen den Todos (Straße 1306 hat zwei) | `todos.find` liefert nur das erste; kein Zähler, keine Blätter-Buttons | Req. 7 |
| 6 | Weiteres Todo anlegbar | Auch zu einer Straße mit Todo lässt sich ein weiteres anlegen | Das Formular bietet nur „Update“ des ersten Todos, kein „Neues Todo“ | Req. 7 |

## Projektstruktur

```
e2e-tests/
├── features/                     # Gherkin-Szenarien (.feature)
│   ├── add-todo.feature
│   ├── map-evaluation.feature
│   ├── navigation.feature
│   ├── road-hover.feature
│   ├── statistics.feature
│   ├── step_definitions/         # Steps → Screenplay-Tasks/Questions
│   └── support/                  # Serenity-Setup, Parametertypen ({actor}/{pronoun}), Cucumber-Hooks (Cleanup)
├── src/
│   ├── config.ts                 # baseURL / apiURL (env-überschreibbar)
│   ├── model/                    # Testdaten & Typen (Straßen, Todos, Grade-Palette)
│   └── screenplay/               # Screenplay-Bausteine, ein Baustein pro Datei
│       ├── actors/               # Cast: BrowseTheWeb (Playwright) + CallAnApi (REST)
│       ├── ui/                   # PageElements je Seite (RoadMap, TodoModal, StatisticsPage …)
│       ├── tasks/                # fachliche Abläufe aus Serenity-Interaktionen (OpenRoadMap, InspectRoad, RemoveTodosForRoad …)
│       └── questions/            # Abfragen für Ensure/Wait (TooltipText, AverageGwGrade …)
├── scripts/
│   ├── check-sut.js              # Fail-fast, wenn SUT nicht läuft
│   └── probe.ts                  # Explorations-Skript (npm run probe) – kein Test
├── cucumber.cjs                  # Cucumber-Profil (ts-node, Serenity-Formatter)
└── package.json
```

### Design-Notizen

- **Screenplay-Akteure im Gherkin:** Die Szenarien sind aus Sicht der Persona
  *Paul* geschrieben. Die Cucumber-Parametertypen in
  `features/support/parameters.ts` verbinden Gherkin und Screenplay:
  `{actor}` (`Given Paul has opened …`) holt den Akteur per `actorCalled`
  auf die Bühne, `{pronoun}` (`he`/`she`/`they`, `When he clicks …`) greift
  per `actorInTheSpotlight()` auf den zuletzt genannten Akteur zurück. Der
  Report liest sich dadurch als „Paul opens … / he should see …". Die
  Cleanup-Hooks nutzen einen eigenen Hintergrund-Akteur (`Test Data Manager`).
- **Idempotent & self-cleaning:** Vor/Nach den `@todos`-Szenarien werden alle
  Todos von Straße `fid 1307` per API entfernt (wie die Newman-Suite), damit
  der Klick garantiert eine **neue** Maßnahme anlegt (`POST`, nicht `PUT`).
- **Leaflet-Karte:** Straßen sind SVG-`<path>`-Elemente und werden mit den
  Serenity-Interaktionen `Click`/`Hover` bedient (`RoadMap.road(index)`), ohne
  direkten Zugriff auf die Playwright-Page. Der Tooltip hat
  `pointer-events: none`; Serenitys `isVisible()` prüft per `elementFromPoint`
  und meldet ihn daher nie sichtbar – `InspectRoad` wartet deshalb mit
  `isPresent()`.
- **Dünne Steps:** Step-Definitionen rufen nur Tasks auf und prüfen mit
  `Ensure` gegen Questions; Warten, Navigation und API-Aufrufe stecken in den
  Tasks (`OpenTodoFormForRoad`, `InspectRoad`, `FetchRoads` …).
- **Farbprüfung:** Der vom Browser berechnete `rgb(...)`-Stroke-Wert einer
  Straße muss der Palettenfarbe ihrer Note laut `/roads` entsprechen – nicht
  bloß irgendeiner Palettenfarbe. Die Referenzstraße fid 5646 hat vier
  verschiedene Farben über die Bewertungen (mehr gibt der Datenbestand nicht
  her: `twsub` ist immer gleich `gw`, `twgeb`/`tweben` sind immer 1), und die
  Wechsel-Reihenfolge im Szenario ändert die Farbe bei jedem Schritt.

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
