# Metadaten, Version 1

## Dateien und Namensräume

- `data/catalog.json`: zentrale, Foundry-unabhängig auslesbare Beschreibung des Sets.
- `data/catalog.schema.json`: JSON Schema (Draft 2020-12) für diese Struktur.
- `data/decks/{styleId}.json`: native Foundry-Deckdaten, keine fremden Importformate.
- `pack-source/dragon-decks/`: dieselben Vorlagen mit Schlüsseln für das offizielle Pack-Werkzeug.
- `data/source-inventory.json`: Dateizuordnung und SHA-256-Prüfsummen der unveränderten Quellen.

Foundry-Zusätze stehen im Katalog unter
`variants[].extensions['dragon-cards-card-deck']`. Auf Foundry-Dokumenten werden
sie ausschließlich unter `flags['dragon-cards-card-deck']` abgelegt.
Kein Einsatz von TavernGames-Flags oder systemabhängigen `system`-Daten.

## Kartenarten

| standardSuit | Anzeige | Standardfarbe | Dateipräfix |
|---|---|---|---|
| hearts | Bierkrug | Herz | Bierkrug |
| clubs | Schwert | Kreuz | Schwert |
| spades | Schild | Pik | Schild |
| diamonds | Münze | Karo | Muenze |

## Logische Karten

| Feld | Bedeutung |
|---|---|
| id | Stabile, stilunabhängige Kennung; niemals aus dem Anzeigenamen ableiten |
| standardSuit | hearts, clubs, spades, diamonds oder null beim unabhängigen Joker |
| standardRank | 2–10 als String, jack, queen, king, ace oder joker |
| standardSuitName / standardRankName | Standardbezeichnung, etwa Herz / Bube |
| suitName | Individuelle Kartenart, etwa Bierkrug; sonst null |
| dragonRankName | Drachennestling, Jungdrache, Ausgewachsener Drache, Uraltdrache oder Urdrache; bei Zahlen null |
| displayName | Individueller Anzeigename, etwa Bierkrug · Drachennestling |
| jokerKind | null, suited oder independent |
| jokerVariant | Licht, Schatten oder Kosmos bei unabhängigen Jokern; sonst null |
| rankSort | 2–10, Bube 11, Dame 12, König 13, Ass 14, Joker 15; reine Sortierhilfe |

IDs regulärer Karten: `hearts-02` … `hearts-10`, `hearts-jack`,
`hearts-queen`, `hearts-king`, `hearts-ace`, entsprechend für die übrigen Farben.
Farbgebundene Joker: `hearts-joker`, `clubs-joker`, `spades-joker`, `diamonds-joker`.
Unabhängige Joker: `joker-independent-01` (Licht), `-02` (Schatten), `-03` (Kosmos).
Diese Kennungen beschreiben keine Spielregeln, Punkte oder Stichlogik.

## Varianten und Bildpfade

`realistic`, `illuminated`, `stylized` sind stabile Stilkennungen.
Jede Variante enthält `fronts`, eine Zuordnung aller 59 logischen IDs zu Bildern,
und genau einen `back`-Pfad. Diese Pfade sind relativ zur Modulwurzel (`assetBase:
module-root`), enthalten keine absoluten Laufwerkspfade und keine externen URLs.

Foundry erwartet Pfade relativ zu seinem Datenverzeichnis, beispielsweise
`modules/dragon-cards-card-deck/assets/fronts/realistic/Bierkrug_02.webp`.
Die API ergänzt diesen Präfix. Die drei vorhandenen Rückseiten haben verschiedene
SHA-256-Prüfsummen. Daher liegen tatsächlich drei, nicht eine, Rückseitendateien vor.
Alle 180 eingebundenen WebP-Dateien haben 1000 × 1500 Pixel.

## Foundry-Abbildung

Die drei vorbereiteten Decks verwenden `Cards.type = deck`; die 59 eingebetteten
Karten jeweils `Card.type = base`, eine Vorderseite, einen Rückseitenpfad und
anfänglich `drawn = false`. Native `suit`- und `value`-Felder sind Sortierhilfen.
`value` entspricht `rankSort`, ausdrücklich keinem Spielwert.
Es werden keine Welt-ID-Verweise als Kartenursprung fest eingebrannt.

Native eingebettete Karten-IDs sind deterministische 16-stellige Kennungen und
über alle drei Vorlagen gleich; Deck-IDs unterscheiden sich pro Stil. Foundry kann
beim Import Dokument-IDs ändern. Deshalb bleibt `flags[Modul-ID].cardId` die
verbindliche logische Identität. Die Flags enthalten außerdem Set, Stil,
Standardfarbe, Standardrang, Jokerart, Jokervariante und Schemaversion.

## Lese-API (apiVersion 1)

| Aufruf | Ergebnis |
|---|---|
| getCatalog() | Kopie des gesamten Katalogs |
| listSets() | Variantenübersicht ohne große Vorderseiten-Zuordnung |
| getSet(styleId) | Variante einschließlich aller Bildpfade |
| getCard(cardId) | Logische Karte ohne Bindung an einen Stil |
| getArtwork(styleId, cardId) | front/back als Foundry-Datenpfade |

Alle Methoden sind asynchron. Unbekannte IDs lösen `RangeError` aus. HTTP- und
Schemafehler werden weitergegeben; fehlgeschlagene Leseversuche können wiederholt
werden. Ergebnisse sind Kopien; Änderungen daran verändern den Katalog nicht.
Die API importiert keine Dokumente, ändert keine Welt und bietet keinen allgemeinen
Uploader oder Fremdkarten-Importer.
