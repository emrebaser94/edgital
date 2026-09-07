# Praktische Testaufgabe – Quality Assurance Engineer (m/w/d)

## 1. Worum geht es?

Wir entwickeln eine SaaS-Plattform: eine Mobile App zur Datenerfassung, eine Web-App zur Visualisierung, dazwischen Pipelines und Cloud-Verarbeitung. Für diese Aufgabe bekommst du eine kleine, in sich geschlossene Web-Anwendung – „Road Overview" –, die nach denselben Grundprinzipien aufgebaut ist wie unsere echte Plattform: ein Frontend, eine Backend-API und die Visualisierung von Geodaten auf einer Karte.

Road Overview ist NICHT Teil unseres produktiven Systems, sondern ein eigenständiges Testobjekt. Es geht uns nicht darum, dass du jede Kleinigkeit findest, sondern darum, wie du als QA Engineer an eine neue Anwendung herangehst: Anforderungen verstehen und hinterfragen, Testszenarien ableiten, systematisch und explorativ testen, Ergebnisse nachvollziehbar dokumentieren und kommunizieren.

Dieses Repository enthält zwei Dinge: diese Aufgabenstellung (README.md im Root) und im Unterordner `sut/` („System Under Test") die eigentliche Anwendung, die du testen sollst.

## 2. Über die Anwendung

„Road Overview" ist eine React-Webanwendung, die Straßenzustandsdaten (GeoJSON) auf einer Karte visualisiert und dazu Statistiken sowie eine kleine Maßnahmen-Verwaltung („Todos") bietet. Sie wurde vor einiger Zeit von einem Frontend-Entwickler auf Basis der in Abschnitt 4 abgedruckten Original-Anforderungen umgesetzt.

Die Anwendung besteht aus zwei Teilen:

- Einer Backend-API (json-server) unter `http://localhost:3000` mit den Endpunkten `GET /roads` (GeoJSON mit Straßendaten und Bewertungen) und `GET`/`POST /todos` (Maßnahmen je Straße).
- Einer React-Web-App unter `http://localhost:5173`, die diese API konsumiert.

Der gesamte Code dafür liegt im Unterordner **`sut/`** – dort findest du auch eine eigene, ausführlichere `README.md` mit allen Details zum Setup.

## 3. Setup

Du erhältst dieses Repository als ZIP (oder Link). Der Anwendungscode liegt im Unterordner `sut/` – wechsle zunächst dorthin.


Von dort findest du zwei Wege, die Anwendung zu starten (Details in `sut/README.md`):

- **Docker (empfohlen):** `docker compose up --build` im Ordner `sut/`.
- **Ohne Docker:** API und Frontend jeweils separat per npm starten (Details in `sut/README.md`).

Danach ist die App unter `http://localhost:5173` erreichbar, die API direkt unter `http://localhost:3000`. Bei Problemen: siehe Troubleshooting-Abschnitt in `sut/README.md`, sonst melde dich gerne bei uns – das Setup selbst ist nicht Teil dessen, was wir bewerten.

> Hinweis: Die Kartenkacheln werden live von OpenStreetMap geladen – dafür braucht dein Browser eine Internetverbindung.

## 4. Ursprüngliche Anforderungen (Grundlage für dein Testing)

*Die folgende Aufgabenstellung wurde dem Frontend-Entwickler damals unverändert als Spezifikation gegeben. Sie ist deine primäre Referenz, um die Anwendung zu bewerten – genau wie im echten Arbeitsalltag interpretierst und hinterfragst du diesen Text selbst.*

### Über das Repository

Dieses Repository enthält einen einfachen json-server (basierend auf der Datei `db.json`), der in einem Docker-Container läuft. Der Server stellt zwei Endpunkte bereit: Der erste liefert eine GeoJSON-FeatureCollection mit Straßen, der zweite ein JSON-Array mit Todos. Der Server ist unter `http://localhost:3000` erreichbar.

Endpunkte:

- `GET /roads` – liefert eine GeoJSON-FeatureCollection mit Straßen und ihren Bewertungen
- `GET /todos` – liefert ein JSON-Array mit Todos
- `POST /todos` – fügt ein Todo zur Datenbank hinzu

### Die Aufgabe (Original-Wortlaut)

1. Erstelle eine React-App mit einer Kartenkomponente (z. B. Leaflet).
2. Lade die GeoJSON-FeatureCollection vom Server und stelle sie auf der Karte dar.
3. Färbe die Straßen entsprechend ihrer eemi-Bewertung ein (1–1.49 = blau, 1.5–2.49 = hellgrün, 2.5–3.49 = dunkelgrün, 3.5–4.49 = gelb, 4.5–5.00 = rot); da es verschiedene Bewertungsarten gibt, füge ein Dropdown zur Karte hinzu, mit dem sich die anzuzeigende Bewertung auswählen lässt, z. B. GW, TWRIO, RISS, …
4. Füge der Karte eine Legende hinzu.
5. Erstelle Hover-Effekte für die Straßen (z. B. Hervorhebung der Straße sowie Anzeige von Attributen und grob gefassten Bewertungen in einem Tooltip).
6. Erstelle eine Seitenleiste mit einer Tabelle und Diagrammen, die durchschnittliche Statistiken über alle Straßen zeigt (z. B. durchschnittlicher GW-Wert) – finde weitere interessante Statistiken und stelle sie in sinnvollen Diagrammen und Tabellen dar.
7. Füge die Möglichkeit hinzu, Todos (Titel, Beschreibung, Status, Autor, road_fid) zu Straßen hinzuzufügen (z. B. Öffnen eines Modals mit einem Formular beim Klick auf eine Straße, um ein neues Todo hinzuzufügen bzw. ein bestehendes zu aktualisieren) – die Todos sollen über den Endpunkt POST /todos in der json-server-Datenbank gespeichert werden.
8. Füge eine Navigationsleiste mit Links zu den verschiedenen Seiten hinzu (z. B. Karte, Übersichtstabelle der Straßen (nur Attribute), Übersichtstabelle der Bewertungen, Übersichtstabelle der Todos).
9. Gestalte die App mit Tailwind, style sie ansprechend mit Farbpaletten und Icons.
10. Containerisiere die App und füge ein README.md mit Anleitung zum Ausführen der App hinzu.

*Hinweis (im Original enthalten): Falls du dir bei den Anforderungen unsicher bist, triff gerne eigene Annahmen und dokumentiere sie im README.md!*

## 5. Deine Aufgabe

### Schritt 1 – Einarbeitung

Mach dich mit der App und den Anforderungen aus Abschnitt 4 vertraut. Starte die Anwendung (siehe Abschnitt 3) und verschaff dir einen Überblick.

### Schritt 2 – User Flows / Testszenarien identifizieren

Leite aus den Anforderungen die wichtigsten Nutzer-Workflows bzw. Use Cases ab (z. B. „Nutzer:in wählt eine Bewertung aus und beurteilt den Straßenzustand auf der Karte", „Nutzer:in erfasst eine neue Maßnahme für eine Straße"). Dokumentiere diese strukturiert – z. B. als Tabelle mit Use Case, Vorbedingungen, Schritten und erwartetem Ergebnis.

### Schritt 3 – Explorative Tests

Teste die Anwendung explorativ entlang der von dir identifizierten Flows und der Anforderungen aus Abschnitt 4. Dokumentiere jede Auffälligkeit mit:

- Titel / Kurzbeschreibung
- Schweregrad (z. B. kritisch / hoch / mittel / niedrig)
- Schritten zur Reproduktion
- Erwartetem vs. tatsächlichem Verhalten
- Bezug zur jeweiligen Anforderung (Traceability) – auf welche Zeile/welchen Punkt aus Abschnitt 4 bezieht sich der Fund?
- Screenshot, wenn hilfreich

### Schritt 4 – Anforderungen kritisch hinterfragen

Welche Anforderungen sind unklar, unvollständig oder mehrdeutig interpretierbar? Wo hätte aus deiner Sicht vor der Umsetzung nachgefragt werden müssen? Wo hat der Entwickler erkennbar eigene Annahmen getroffen, die man hätte dokumentieren sollen? Das ist ausdrücklich Teil der Aufgabe – nicht nur „Bugs finden", sondern auch die Spezifikation selbst bewerten.

### Schritt 5 – API-Tests (Pflicht)

Baue eine Postman-Collection (oder ein vergleichbares Tool), die die Backend-Endpunkte gegen die laufende Testumgebung prüft: `GET /roads`, `GET /todos`, `POST /todos` – und was du sonst über die json-server-Dokumentation an Funktionalität findest (z. B. Filtern, Sortieren, einzelne Datensätze per ID, Fehlerfälle). Teste nicht nur den Happy Path, sondern auch Negativ- und Edge-Cases.

### Schritt 6 – Bonus (freiwillig): Automatisierung

Wenn du Lust und Zeit hast: Erweitere die Testabdeckung um automatisierte End-to-End-Tests (z. B. mit Playwright) für einen oder mehrere der von dir identifizierten User Flows, oder erweitere den Code in `sut/` um einen kleinen Fix. Das ist ein Bonus – keine Voraussetzung, um die Aufgabe gut zu lösen.

## 6. Einsatz von KI-Tools

KI-gestützte Tools (ChatGPT, Claude / Claude Code, GitHub Copilot, Cursor, …) gehören heute zum Alltag – wir wollen sie nicht verbieten, aber an der richtigen Stelle einsetzen:

- **Schritt 2–4 (User Flows, exploratives Testen, Anforderungsanalyse):** bitte ohne KI-generierte Bug-Listen oder Analysen. Hier wollen wir dein eigenes analytisches Denken und deine Testerfahrung sehen. Nachschlagen/Recherche ist selbstverständlich in Ordnung.
- **Schritt 5–6 (Postman, Automatisierung/Code):** KI-Tools sind ausdrücklich erlaubt und willkommen – das entspricht realer Arbeitsweise. Bitte mach im Ergebnis transparent, wo und wie du sie eingesetzt hast.

## 7. Zeitrahmen

Plane realistisch nicht mehr als ca. 6–8 Stunden Gesamtaufwand ein, verteilt über 1–2 Tage. Uns ist eine saubere Priorisierung wichtiger als Vollständigkeit – wenn dir die Zeit knapp wird, dokumentiere kurz, was du aus Zeitgründen nicht mehr geschafft hast, statt zu hetzen.

## 8. Abgabe & Präsentation

Fasse deine Ergebnisse in einer kurzen PowerPoint-Präsentation zusammen (kein Roman – lieber knapp und klar strukturiert). Vorschlag für den Aufbau:

1. Vorgehen (wie bist du rangegangen, wie viel Zeit hast du investiert?)
2. Identifizierte User Flows / Testszenarien
3. Ergebnisse der explorativen Tests – priorisierte Liste inkl. Anforderungsbezug
4. Kritische Anmerkungen zu den Anforderungen
5. API-Test-Showcase (Postman)
6. (Bonus) Automatisierung
7. Fazit – was würdest du vor einem Go-Live noch fordern?

In unserem gemeinsamen Termin bitten wir dich, aus den Folien heraus live in deine Artefakte zu springen (Anwendung, Postman-Collection, ggf. Code) – bereite dich entsprechend vor.

## 9. Worauf wir achten

- Wie strukturiert und nachvollziehbar du an die Aufgabe herangehst
- Tiefe und Relevanz deiner Funde – Priorisierung nach Schweregrad/Risiko statt reiner Menge
- Ob du deine Funde auf konkrete Anforderungen zurückführen kannst (Traceability)
- Qualität und Abdeckung deiner API-Tests (inkl. Negativfällen)
- Klarheit deiner Kommunikation und Präsentation
- (Bonus) Sinnvoller, nachvollziehbarer Einsatz von Automatisierung/KI-Tools

## 10. Fragen?

Melde dich jederzeit bei uns – lieber einmal zu viel nachgefragt als in die falsche Richtung getestet.