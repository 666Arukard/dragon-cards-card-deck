# Dragon Cards - Card Deck

Version 1.0.0 · Daniel Brune und ChatGPT/Codex (KI-Unterstützung) · Zielplattform: Foundry VTT V14.

Eigenständiges, optionales Inhaltsmodul für das Dracima-Drachenkartenset.
Ein natives Kartenkompendium enthält drei Decks: realistische Fantasy,
mittelalterliche Buchmalerei und stilisierte Illustration. Jedes Deck hat
59 Karten: 52 reguläre Karten, vier farbgebundene und drei unabhängige Joker.
Keine Kartenspielregeln, keine verpflichtenden Abhängigkeiten, keine TavernGames-Integration.

## Installation

In Foundrys Einrichtung unter **Zusatzmodule → Modul installieren** diese Manifest-URL eintragen:

`https://github.com/666Arukard/dragon-cards-card-deck/releases/latest/download/module.json`

Anschließend das Modul in der gewünschten Welt aktivieren und die Decks aus dem
Kompendium importieren. Spätere Veröffentlichungen werden über diese stabile
Manifest-Adresse für Foundrys Updateprüfung bereitgestellt.

Alternativ manuell installieren:

1. Foundry beenden. ZIP entpacken und den enthaltenen Ordner
   `dragon-cards-card-deck` nach `{Foundry-Benutzerdaten}/Data/modules/` kopieren.
2. Die Datei muss dann unter `Data/modules/dragon-cards-card-deck/module.json` liegen.
   Versehentliche doppelte Unterordner vermeiden.
3. Foundry neu starten, eine V14-Welt öffnen und unter „Module verwalten“
   **Dragon Cards - Card Deck** aktivieren.
4. Im Kompendium **Dragon Cards · Drei Drachenkartendecks** die gewünschte
   Variante auswählen und per „Importieren“ oder Drag-and-drop in die
   Kartenverwaltung übernehmen. Ein importiertes Deck enthält 59 Karten.

Die Veröffentlichung erfolgt über GitHub. Sie beansprucht keine Aufnahme oder
Freigabe im offiziellen Foundry-Paketverzeichnis.

## Verwendung

Das Modul erzeugt beim Aktivieren keine Weltdecks und verändert vorhandene Decks
nicht. Die Decks im Kompendium sind Vorlagen; zum Spielen eine eigene Weltkopie
importieren. Für mehrere Spielrunden unabhängige Kopien verwenden.

Mischen, Austeilen, Ziehen, Ablegen und Zurücksetzen erfolgen über Foundrys native
Kartenoberflächen. Eigene Hände und Ablagestapel legt die Spielleitung bei Bedarf an.
Ein Stilwechsel wird nicht automatisch auf laufende Decks oder ausgeteilte Karten
angewendet. Eine spätere Auswahl durch TavernGames wird nicht hier implementiert.

Die vorbereiteten Decks haben `ownership.default = 0` (kein allgemeiner Zugriff).
Für eine private Spielerhand: Typ „Hand“, Standardberechtigung „Keine“, nur dem
zugehörigen Spieler „Besitzer“ geben. Andere Hände nicht pauschal freigeben.
Die Spielleitung kann zunächst selbst austeilen. Soll ein Spieler selbst ziehen,
die benötigten Quellstapelrechte ausdrücklich in einer Testwelt prüfen; das Modul
erhöht keine Berechtigungen und implementiert keine privilegierte Weiterleitung.
Der Katalog und die Bilddateien sind keine geheimen beziehungsweise verschlüsselten
Spieldaten; die Vertraulichkeit einer Hand hängt von Foundrys Dokumentrechten ab.

## Metadaten und optionale API

`data/catalog.json` ist ohne Foundry lesbar. Die 59 logischen Karten sind dort einmal
definiert; drei Varianten ordnen ihnen jeweils Vorderseiten und eine Rückseite zu.
Kartenkennungen sind in allen Stilen gleich. Unterschiedliche Rückseiten werden
einmal je Stil gespeichert, nicht je Karte.

Nach dem Foundry-`init`-Hook:

```js
const api = game.modules.get('dragon-cards-card-deck')?.api;
const sets = await api.listSets();
const card = await api.getCard('hearts-02');
const artwork = await api.getArtwork('illuminated', 'hearts-02');
```

Alternativ ohne API:

```js
const catalog = await fetch('modules/dragon-cards-card-deck/data/catalog.json')
  .then(response => { if (!response.ok) throw Error(response.status); return response.json(); });
```

Die API liest ausschließlich Daten. Details: [METADATA.md](docs/METADATA.md).

## Kompatibilität und Prüfstand

Eine vollständige V14-Abnahme durch den Entwickler ist noch nicht in einer laufenden Foundry-Version
verifiziert. Referenz: offizielle V14-API, Dokumentationsstand 14.368. Im Manifest
steht daher absichtlich kein `compatibility.verified`. Eine Foundry-Warnung über
fehlende Verifizierung ist möglich und darf nicht als durchgeführter Test ausgelegt werden.

Paket-, Metadaten-, Pfad-, Grafik-, API- und LevelDB-Prüfungen sind in
[TESTS.md](docs/TESTS.md) dokumentiert. Eigenständige Entwicklertests für Import, Mischen, Austeilen, Ziehen,
Zurücksetzen und tatsächliche Spieler-Client-Berechtigungen sind noch offen.
Ein optionaler, ausschließlich manuell gestarteter Test ist enthalten.

## Rechte und Herkunft

Nichtkommerzielle Nutzung für alle; Veränderungen und Weitergabe mit Namensnennung
**Daniel Brune**. Für Code und Grafiken gibt es getrennte Dokumente:
[LICENSE-CODE.md](LICENSE-CODE.md) und [LICENSE-ARTWORK.md](LICENSE-ARTWORK.md).
Die Grafiken sind KI-generiert beziehungsweise basieren auf KI-Bildern. Das
Dracima-Symbol stammt aus der vom Auftraggeber bereitgestellten Vorlage.
Keine Behauptung exklusiver Urheberrechte an rein KI-generierten Anteilen.

## Für Entwickler

Das Paket enthält JSON-Deckvorlagen, Kompendiumquellen, Tests und Werkzeuge.
Foundry selbst benötigt keine npm-Abhängigkeiten. Zum erneuten Kompilieren:
Node.js verwenden, `npm install`, `npm run pack`, `npm test`, `npm run validate`.
Das offizielle Foundry-CLI ist als reine Entwicklungsabhängigkeit festgehalten.
Die Originalgrafiken werden beim Build nicht neu generiert oder konvertiert.

[Versionshinweise](CHANGELOG.md) · [Offizielle Referenzen](docs/SOURCES.md)

## Veröffentlichung

[Repository und Release-Adressen](docs/GITHUB-SETUP.md). Keine zusätzliche `website.json`; Inhalte für die eigene Website werden manuell gepflegt.


### Vom Nutzer bestätigter Praxistest

Daniel Brune bestätigt Foundry V14 Build 369: alle drei Decks importiert, jeweils 59 Karten insgesamt und 59 verfügbar; Ziehen funktioniert. Weitere Kartenaktionen wurden als funktionierend gemeldet, aber nicht einzeln protokolliert. Die separate Prüfung fremder Spielerhände steht aus. Dieser Nachweis ist kein eigener Live-Test durch ChatGPT/Codex.

Repository: https://github.com/666Arukard/dragon-cards-card-deck

