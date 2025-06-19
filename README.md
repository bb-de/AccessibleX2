# AccessibleX2

## Übersicht
AccessibleX2 ist ein barrierefreies Widget für Webseiten mit umfangreichen Accessibility-Features und eigenem Server-Backend.

## Voraussetzungen
- Node.js (empfohlen: v18 oder neuer)
- npm (wird mit Node.js installiert)

## Installation
1. Repository klonen:
   ```bash
   git clone <REPO-URL>
   cd AccessibleX2
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

## Server starten
Das Projekt besteht aus einem Frontend (React) und einem Backend (Node.js/Express).

### Entwicklung (Frontend + Backend gleichzeitig)
```bash
npm run dev
```
- Das Frontend ist dann meist unter http://localhost:5173 erreichbar.
- Das Backend läuft auf http://localhost:3001 (Standard).

### Nur Backend-Server starten
```bash
cd server
node index.js
```
- Der Server lauscht auf Port 3001 (sofern nicht anders konfiguriert).

### Nur Frontend starten
```bash
cd client
npm run dev
```
- Das Frontend ist dann unter http://localhost:5173 erreichbar.

## Hinweise
- Die Konfiguration (z. B. Ports) kann in den jeweiligen Dateien angepasst werden.
- Für den Produktivbetrieb empfiehlt sich ein Reverse Proxy (z. B. nginx) und HTTPS.
- Weitere Details und Umgebungsvariablen siehe Quellcode und Kommentare.

---
© 2025 brandingbrothers.de. Alle Rechte vorbehalten. 