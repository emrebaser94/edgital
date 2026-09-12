# Road Overview – API-Tests (json-server)

Postman-Collection für die Backend-API der „Road Overview"-Anwendung
(`json-server@0.17.4`, erreichbar unter `http://localhost:3000`).

Getestet werden die dokumentierten Endpunkte `GET /roads`, `GET /todos`,
`POST /todos` **sowie** die json-server-Zusatzfunktionen (Filtern, Sortieren,
Paginierung, Einzeldatensätze per ID) und eine Reihe von Negativ- und
Edge-Cases.

- **34 Requests / 78 Assertions**, in 7 thematischen Ordnern
- **Idempotent & self-cleaning:** jeder erzeugte Todo wird per `DELETE` wieder
  entfernt – die Collection kann beliebig oft laufen, ohne Testdaten zu
  hinterlassen.
- Alle Erwartungswerte wurden **empirisch** gegen einen lokalen
  `json-server@0.17.4` verifiziert (nicht nur aus der Doku abgeleitet).

## Dateien

| Datei | Zweck |
|-------|-------|
| `road-overview.postman_collection.json` | Die Collection (Postman v2.1) |
| `road-overview.postman_environment.json` | Environment mit `baseUrl` |

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
   falscher `Content-Type`.
6. **Undokumentierte Methoden** – `PUT` / `PATCH` / `DELETE` auf `/todos/:id`.
7. **Fehler, Methoden & CORS** – unbekannte Route, `DELETE /roads`,
   CORS-Header, `OPTIONS`-Preflight.

## Gefundene Auffälligkeiten (über die API entdeckt)

Diese Funde wurden beim Bau der Tests empirisch beobachtet:

| # | Schwere | Fund |
|---|---------|------|
| 1 | **Kritisch** | `POST /roads` liefert **201** und **überschreibt die komplette FeatureCollection** mit dem geposteten Body (Datenverlust, nicht per API wiederherstellbar). Erwartet: `404`/`405`. |
| 2 | **Hoch** | **Keine Eingabevalidierung** bei `POST /todos`: ein leerer Body `{}` oder ein Todo ohne Pflichtfelder (`title`, `road_fid`) wird mit `201` akzeptiert. |
| 3 | **Mittel** | Falscher `Content-Type` (z. B. `text/plain`) → Body wird **stillschweigend verworfen**, es entsteht ein leerer Datensatz (`{id:N}`). Erwartet: `415`/`400`. |
| 4 | **Niedrig** | README dokumentiert nur `GET`/`POST /todos`; tatsächlich sind auch `PUT`, `PATCH`, `DELETE /todos/:id` verfügbar (undokumentiert). |
| 5 | **Info** | `/roads` ist ein Objekt (keine Array-Ressource) → Filtern/Sortieren/Paginierung **wirken nicht**, `X-Total-Count` fehlt, `GET /roads/:id → 404`. |
| 6 | **Info** | Doppelte ID → `500` (statt `409`); kaputtes JSON → `400` als HTML-Fehlerseite (kein JSON). |

> ⚠️ **Fund #1 (`POST /roads`) ist bewusst NICHT Teil des automatischen
> Laufs**, weil er die Datenbank zerstört und nicht per API wiederherstellbar
> ist (würde die Idempotenz brechen). Reproduktion:
>
> ```bash
> curl -i -X POST -H "Content-Type: application/json" \
>   -d '{"x":1}' http://localhost:3000/roads
> # -> HTTP/1.1 201 Created ; anschließend liefert GET /roads nur noch {"x":1}
> # Danach API neu starten, um die Straßendaten wiederherzustellen.
> ```

## KI-Einsatz (Transparenz, gem. Aufgabenstellung Abschnitt 6)

Diese Collection wurde mit **Claude Code** erstellt. Vorgehen: der json-server
wurde lokal gestartet und jedes erwartete Verhalten (Statuscodes, Header,
Fehlerfälle) per `curl` real beobachtet; die Assertions prüfen dieses
beobachtete Verhalten. Anschließend per Newman verifiziert (2× grün,
34 Requests / 78 Assertions, self-cleaning bestätigt).
