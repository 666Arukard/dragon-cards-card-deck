# Prüfung und verbleibende Foundry-Abnahme

## Ehrlicher Prüfstand

Ziel ist Foundry V14. Keine laufende Foundry-Installation oder Testwelt wurde für
diese Auslieferung verwendet. Keine konkrete Foundry-Version wird als verifiziert
angegeben. Die native Darstellung und sämtliche echten Spiel- und Spieleraktionen
sind deshalb ausdrücklich **noch nicht in Foundry getestet**.

Maschinenlesbare Ergebnisse: [validation-report.json](validation-report.json),
[pack-roundtrip-report.json](pack-roundtrip-report.json) und
[schema-validation-report.json](schema-validation-report.json). Diese Paketprüfungen
ersetzen keine Laufzeitprüfung.

## Durchgeführte technische Prüfungen

- Drei Varianten mit je 59 eindeutigen logischen Kennungen, identisch in allen Stilen.
- Je Variante 52 reguläre Karten, vier farbgebundene und drei unabhängige Joker.
- Standardfarbe, Standardrang, Drachenname, Jokerart und Variante zugeordnet.
- Katalog gegen das JSON Schema Draft 2020-12 mit Ajv 8.17.1 validiert.
- 177 Vorderseiten, drei unterschiedliche, einmalig gespeicherte Rückseiten.
- WebP-Header, 1000 × 1500 Pixel, vorhandene relative Pfade, keine fremden Bild-URLs.
- Vorder-/Rückseiten-Zuordnung und SHA-256 gegen die vorhandenen Quelldateien.
- Native Deckvorlagen: ungezogene Karten, eine Vorderseite, korrekte Rückseite,
  Standardberechtigung 0, gleiche eingebettete IDs bei unterschiedlicher Deck-ID.
- Echter LevelDB-Build mit dem offiziellen Foundry-CLI und erneutes Auslesen aller
  drei Decks samt 177 eingebetteten Karten; Vergleich mit den JSON-Vorlagen.
- Node-Tests der Lese-API: alle 177 Bildzuordnungen, Datenkopien, Cache,
  Fehlermeldungen und Wiederholung nach HTTP-Fehlern.
- Initialisierung mit Test-Doubles: ausschließlich API-Registrierung, keine Weltzugriffe.
  Dieser Test ist ausdrücklich keine simulierte oder tatsächliche Foundry-Verifizierung.
- Archivprüfung und erneuter Vergleich der Originalgrafiken vor der Auslieferung.

## Manuelle Abnahme in einer V14-Testwelt

Jeden Stil getrennt testen. Vorher genaue Foundry-Version und verwendetes System
notieren. Für die erste Abnahme nur dieses Modul aktivieren.

| Prüfung | Erwartung | Auslieferungsstatus |
|---|---|---|
| Aktivieren | Kompendium erscheint, vorhandene Weltdecks bleiben unverändert | Nicht ausgeführt |
| Import | Gewähltes Deck wird als Weltkopie mit 59 verfügbaren Karten angelegt | Nicht ausgeführt |
| Bilder | Bildkarten, Zahlen, Joker und jeweils passende Dracima-Rückseite anzeigen | Nicht ausgeführt |
| Mischen | 59 Karten bleiben erhalten; Sortierung wird neu gesetzt | Nicht ausgeführt |
| Austeilen | Zwei Karten an zwei Hände ergeben vier gezogene und 55 verfügbare Karten | Nicht ausgeführt |
| Ziehen | Eine Hand zieht eine weitere Karte; 54 verbleiben verfügbar | Nicht ausgeführt |
| Zurücksetzen | Karten aus Händen/Ablagen kehren zum Ursprungsdeck zurück; 59 verfügbar | Nicht ausgeführt |
| Zweiter Import | Neue Kopie erzeugen; vorheriges Deck und Hände unverändert | Nicht ausgeführt |
| Spielerhände | Eigene Hand bedienbar, fremde private Hand gesperrt, keine Rechteerhöhung | Nicht ausgeführt |

## Optionaler GM-Smoke-Test

Nur in einer Testwelt bewusst starten. Der Code wird nicht vom Modul geladen oder
automatisch ausgeführt. Er erzeugt neue, markierte Testdecks und Hände, führt native
Methoden aus und entfernt standardmäßig ausschließlich die selbst erstellten
Testdokumente. An vorhandenen Weltdecks nimmt er keine Änderungen vor.

Im Browser als GM:

```js
const {runGmSmokeTest} = await import(
  '/modules/dragon-cards-card-deck/tools/foundry-smoke-test.mjs'
);
const report = await runGmSmokeTest();
console.log(report);
```

Optional `runGmSmokeTest({playerUserId: 'ID_DES_TESTSPIELERS'})`: zusätzlich die
Foundry-Berechtigungsabfragen für eigene und fremde Hand aus Sicht dieses Benutzers
prüfen. Das ersetzt keinen zweiten Browser-Login. Mit `cleanup: false` bleiben die
Testdokumente für Sichtprüfung erhalten. Der Test mischt und verteilt tatsächlich,
aber nur in seinen neu angelegten Testdokumenten.

## Erforderlicher Test mit Spieler-Clients

1. Zwei Testspieler A und B in getrennten Browser-Sitzungen anmelden.
2. Zwei leere Hände anlegen, Standard „Keine“, nur A beziehungsweise B als Besitzer.
3. Als GM Karten verdeckt und offen austeilen; Darstellung jeder Sitzung prüfen.
4. A darf seine Hand bedienen; B darf As private Hand weder ansehen noch bearbeiten.
5. Selbständiges Ziehen durch A zunächst mit privaten Deckrechten versuchen:
   verweigerte beziehungsweise nicht angebotene Aktionen dokumentieren. Falls diese
   Spielweise gewünscht ist, Quellstapelrechte gezielt anpassen und erneut prüfen.
   Nie automatisch „Besitzer für alle“ vergeben.
6. Unberechtigte Schreib-/Austeilversuche im zweiten Client müssen durch Foundry
   abgewiesen werden. Auch nach Neuladen erneut prüfen.
7. Als GM zurücksetzen; beide Hände und die 59 verfügbaren Ursprungskarten prüfen.
8. Erst bei tatsächlich bestandenen Tests Version und Ergebnis im Prüfprotokoll
   festhalten. `compatibility.verified` nicht allein aufgrund dieser Anleitung setzen.

Wichtig für Entwickler: Zum Zurückholen von Spielkarten dient die native Methode
`recall()` beziehungsweise die Zurücksetzen-Oberfläche. `DataModel.reset()` setzt
nur den lokalen Modellzustand zurück und ist kein Kartenrückruf.
