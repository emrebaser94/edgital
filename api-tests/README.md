# Road Overview – API-Tests (json-server)

Postman-Collection für die Backend-API der „Road Overview"-Anwendung
(`json-server@0.17.4`, erreichbar unter `http://localhost:3000`).

Getestet werden die dokumentierten Endpunkte `GET /roads`, `GET /todos`,
`POST /todos` **sowie** die json-server-Zusatzfunktionen (Filtern, Sortieren,
Paginierung, Einzeldatensätze per ID) und eine Reihe von Negativ- und
Edge-Cases.

- **30 Requests / 73 Assertions**, in 7 thematischen Ordnern
- **Assertions prüfen das Soll-Verhalten.** Bekannte Defekte sind mit
  `[DEFECT #n]` markiert und schlagen **bewusst fehl** (4 Assertions, siehe
  [Bewusst rote Tests](#bewusst-rote-tests-defect-n)) – gleiche Konvention wie
  `@defect` in den E2E-Tests.
- **Idempotent & self-cleaning:** jeder erzeugte Todo wird per `DELETE` wieder
  entfernt – auch Datensätze, die wegen eines Defekts fälschlich angelegt
  werden. Die Collection kann beliebig oft laufen, ohne Testdaten zu
  hinterlassen.
- Das Ist-Verhalten wurde **empirisch** gegen einen lokalen
  `json-server@0.17.4` beobachtet (nicht nur aus der Doku abgeleitet).

## Dateien

| Datei | Zweck |
|-------|-------|
| `road-overview.postman_collection.json` | Die Collection (Postman v2.1) |
| `road-overview.postman_environment.json` | Environment mit `baseUrl` |
| `report.html` | Newman-htmlextra-Report des letzten lokalen Laufs (ohne Response-Bodies, gegen die Original-API) |

## Voraussetzungen

Die SUT-API muss laufen und unter `http://localhost:3000` erreichbar sein:

```bash
cd sut
docker compose up --build        # startet API (:3000) + Frontend (:5173)
# oder nur die API:
cd sut/api && json-server -H 0.0.0.0 -p 3000 db.json
```

## Ausführen

### Variante A – Postman (GUI)

1. Postman öffnen → **Import** → beide JSON-Dateien auswählen.
2. Oben rechts das Environment **„Road Overview – Local"** wählen.
3. Collection auswählen → **Run** → *Run Road Overview API*.

### Variante B – Newman (CLI / CI)

Vom Repo-Root – schreibt zusätzlich `api-tests/report.html`:

```bash
npm run test:api
```

Oder direkt im Ordner `api-tests`:

```bash
cd api-tests
npx newman run road-overview.postman_collection.json \
  -e road-overview.postman_environment.json
```

`baseUrl` lässt sich pro Lauf überschreiben (z. B. isolierte Instanz):

```bash
npx newman run road-overview.postman_collection.json \
  --env-var baseUrl=http://127.0.0.1:3001
```

> **Erwartetes Ergebnis:** Exit-Code `1` mit genau **4 roten Assertions**
> (alle `[DEFECT #n]`), solange die Defekte bestehen. Newman meldet
> 32 Requests: die 30 der Collection plus 2 Cleanup-`DELETE`s, die aus
> Test-Skripten gesendet werden. Nach einem Fix der Defekte entfallen diese
> Cleanups (dann 30 Requests / 71 Assertions, alle grün) – genau das zeigt ein
> Lauf gegen die reparierte API vom Branch `feature/sut-defect-fixes`.

## Ergebnisse lesen

| Wo | Was man sieht |
|---|---|
| **Konsole** | Am Ende die Zusammenfassung (`assertions … executed / failed`) und darunter eine nummerierte Fehlertabelle: Assertion-Name, Soll/Ist, Ordner und Request. Mit `--reporter-cli-no-success-assertions` erscheinen nur noch die fehlgeschlagenen Assertions. |
| **`report.html`** | HTML-Report ohne Response-Bodies (~0,6 MB statt 8,8 MB, weil `/roads` allein 2,6 MB GeoJSON liefert). Der Tab **Failed Tests** listet nur die roten Assertions. |
| **CI** | Das Log zeigt nur Fehlschläge. Zusammenfassung und Fehlertabelle stehen in der **Job-Summary** des Workflow-Laufs, der vollständige Report auf GitHub Pages unter `api/`. |

Ein Eintrag der Fehlertabelle:

```
1.  AssertionError  [DEFECT #2] empty todo (no title/road_fid) is rejected with 400
                    expected response to have status code 400 but got 201
                    inside "5. POST /todos - negative & edge cases / [DEFECT #2] POST empty body {} -> 400 expected"
```

## Abgedeckte Bereiche

1. **GET /roads** – Happy Path (FeatureCollection-Schema, 773 Features),
   ignorierte Query-Parameter (Limitation), `GET /roads/:id → 404`.
2. **GET /todos** – Happy Path + Schema, Einzeldatensatz, nicht-existente und
   nicht-numerische IDs.
3. **GET /todos – Filter/Sort/Pagination** – `?feld=`, Operatoren
   (`_gte`, `_like`), Volltext `?q=`, `_sort`/`_order`, `_page`/`_limit`
   (inkl. `X-Total-Count` + `Link`), `_start`/`_end`.
4. **POST /todos – Happy Path** – Anlegen (201, `Location`, ID-Vergabe),
   Persistenz prüfen, wieder löschen.
5. **POST /todos – Negativ/Edge** – leerer Body, doppelte ID, kaputtes JSON,
   falscher `Content-Type` – jeweils mit Soll-Erwartung (bewusst rot).
6. **Undokumentierte Methoden** – `PUT` / `PATCH` / `DELETE` auf `/todos/:id`.
7. **Fehler & Methoden** – unbekannte Route, `DELETE /roads`.

## Bewusst rote Tests (`[DEFECT #n]`)

Diese Assertions prüfen das **Soll** und scheitern daher absichtlich. Ein roter
Lauf heißt: der Defekt besteht noch. Wird er behoben, wird der Test ohne
Änderung grün.

| Finding | Assertion | Soll | Ist |
|---|---|---|---|
| #2 | `[DEFECT #2] empty todo (no title/road_fid) is rejected with 400` | `400` | `201`, Datensatz nur mit `id` |
| #3 | `[DEFECT #3] non-JSON Content-Type is rejected with 415 (or 400)` | `415` / `400` | `201`, Body verworfen |
| #5 | `[DEFECT #5] duplicate id is rejected with 409 Conflict` | `409` | `500` |
| #5 | `[DEFECT #5] error response is JSON, not an HTML page` | `application/json` | `text/html` |

Finding #1 (`POST /roads`) ist **nicht** automatisiert – destruktiv, siehe
unten.

> Hinweis CI: Das Gate in `.github/workflows/tests.yml` ist dadurch rot,
> solange die Defekte bestehen – analog zu den `@defect`-Szenarien der
> E2E-Suite.

## Gefundene Auffälligkeiten (über die API entdeckt)

Diese Funde wurden beim Bau der Tests empirisch beobachtet:

| # | Schwere | Fund | Test |
|---|---------|------|------|
| 1 | **Kritisch** | `POST /roads` liefert **201** und **überschreibt die komplette FeatureCollection** mit dem geposteten Body (Datenverlust, nicht per API wiederherstellbar). Erwartet: `404`/`405`. Auslösbar von jeder fremden Webseite, siehe unten. | manuell (destruktiv) |
| 2 | **Hoch** | **Keine Eingabevalidierung** bei `POST /todos`: ein leerer Body `{}` (ohne `title` und `road_fid`) wird mit `201` akzeptiert. | `[DEFECT #2]` rot |
| 3 | **Mittel** | Falscher `Content-Type` (z. B. `text/plain`) → Body wird **stillschweigend verworfen**, es entsteht ein leerer Datensatz (`{id:N}`). Erwartet: `415`/`400`. | `[DEFECT #3]` rot |
| 4 | **Niedrig** | README dokumentiert nur `GET`/`POST /todos`; tatsächlich sind auch `PUT`, `PATCH`, `DELETE /todos/:id` verfügbar (undokumentiert, das Frontend nutzt `PUT` und `DELETE`). Doku-Lücke, die API selbst funktioniert. | grün |
| 5 | **Niedrig** | Schwache Fehlersemantik: doppelte ID → `500` (statt `409`); Fehler kommen als HTML-Seite statt JSON (z. B. kaputtes JSON → `400` `text/html`). | `[DEFECT #5]` rot (2×) |
| 6 | **Info** | `/roads` ist ein Objekt (keine Array-Ressource) → Filtern/Sortieren/Paginierung **wirken nicht**, `X-Total-Count` fehlt, `GET /roads/:id → 404`. | grün (Limitierung dokumentiert) |

> ⚠️ **Fund #1 (`POST /roads`) ist bewusst NICHT Teil des automatischen
> Laufs**, weil er die Datenbank zerstört und nicht per API wiederherstellbar
> ist (würde die Idempotenz brechen). Reproduktion:
>
> ```bash
> curl -i -X POST -H "Content-Type: application/json" \
>   -d '{"x":1}' http://localhost:3000/roads
> # -> HTTP/1.1 201 Created ; anschließend liefert GET /roads nur noch {"x":1}
>
> # Gleicher Effekt ohne Preflight, d. h. aus jeder fremden Webseite auslösbar:
> curl -i -X POST -H "Content-Type: text/plain" -H "Origin: http://evil.example" \
>   -d '{"x":1}' http://localhost:3000/roads
> # -> 201 Created ; GET /roads liefert danach {} (alle 773 Straßen weg)
> # Danach API neu starten, um die Straßendaten wiederherzustellen.
> ```

> Nicht als eigener Fund gelistet: json-server läuft mit
> `cors({ origin: true, credentials: true })` und spiegelt jede `Origin`.
> Das betrifft nur das **Lesen** der Antworten – der destruktive Schreibzugriff
> oben funktioniert ohnehin ohne CORS (Simple Request mit `text/plain`, kein
> Preflight). Vor einem Go-Live gehört CORS trotzdem auf die App-Origin
> begrenzt.

## KI-Einsatz (Transparenz, gem. Aufgabenstellung Abschnitt 6)

Diese Collection wurde mit **Claude Code** erstellt. Vorgehen: der json-server
wurde lokal gestartet und jedes Verhalten (Statuscodes, Header, Fehlerfälle)
per `curl` real beobachtet. Die Assertions prüfen das **Soll-Verhalten**;
Abweichungen sind als `[DEFECT #n]` markiert und schlagen bewusst fehl.
Verifiziert per Newman gegen eine isolierte json-server-Instanz
(30 Requests / 73 Assertions / 4 bewusst rot; self-cleaning bestätigt – die
Todo-Liste ist vor und nach dem Lauf identisch).
