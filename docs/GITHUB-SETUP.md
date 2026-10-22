# Eigenes GitHub-Repository

## Stand

Lokale Vorbereitung für `666Arukard/dragon-cards-card-deck`, öffentlich und mit
Hauptzweig `main`, entsprechend TavernGames. Der vorhandene TavernGames-Zugang
kann dieses zusätzliche Repository nicht anlegen (GitHub HTTP 403).
Daniel hat das öffentliche Remote-Repository am 22. Oktober 2026 selbst angelegt. Der initiale Quellstand wird anschließend separat hochgeladen; Tags und Releases bleiben zurückgestellt.
Die Modulversion bleibt 0.1.0. Version 1.0.0 ist ausdrücklich zurückgestellt.

## Einmal auf GitHub anlegen

1. Auf GitHub als `666Arukard` anmelden und „New repository“ öffnen.
2. Name: `dragon-cards-card-deck`.
3. Beschreibung: Eigenständiges Foundry-VTT-Kartenmodul mit drei
   Dracima-Drachenkartendecks – ohne Spielregeln.
4. Sichtbarkeit: öffentlich, wie TavernGames.
5. README, .gitignore und Lizenz dort nicht automatisch hinzufügen: passende
   Dateien einschließlich der individuellen Nutzungsbedingungen liegen hier vor.
6. Repository erstellen und den Link in diesem Chat nennen.

## Zugang für den ersten Upload

Der bisherige verschlüsselte TavernGames-Zugang ist vorhanden, aber offenbar auf
ausgewählte Repositorys begrenzt. Nach dem Anlegen das neue Repository in dessen
Repository-Auswahl ergänzen; für einen Quellcode-Upload wird „Contents: Read and
write“ benötigt. Alternativ kann ein passender GitHub-Connector verwendet werden.
Keine Schlüssel in Chat, Repository, JSON-Dateien oder ZIPs eintragen.

## Quellcode und Release trennen

Der Repository-Quellstand enthält Skripte, Dokumentation, JSON-Metadaten,
Kompendiumquellen, das kompilierte Kompendium und die 180 einzelnen WebP-Dateien.
Die größten Einzeldateien sind nur etwa 2 MiB groß. Sie können regulär versioniert
werden. Geheimnisse, node_modules und ZIP-Archive sind ausgeschlossen.

Das installierbare ZIP gehört später als eigener Release-Anhang auf GitHub,
nicht als große Datei in die Git-Historie. Die individuellen nichtkommerziellen
Nutzungsbedingungen werden übernommen; keine automatische MIT-Lizenz hinzufügen.

## Spätere Release-Adressen (noch nicht veröffentlicht)

- Repository: `https://github.com/666Arukard/dragon-cards-card-deck`
- Stabiles Foundry-Manifest:
  `https://github.com/666Arukard/dragon-cards-card-deck/releases/latest/download/module.json`
- Geplantes ZIP für 1.0.0:
  `https://github.com/666Arukard/dragon-cards-card-deck/releases/download/v1.0.0/dragon-cards-card-deck-1.0.0.zip`
- Versionshinweise für 1.0.0:
  `https://github.com/666Arukard/dragon-cards-card-deck/releases/tag/v1.0.0`

Diese Adressen sind ein Plan, keine vorhandenen Downloads. Sie werden erst in das
Veröffentlichungsmanifest eingetragen, wenn Repository und Release-Ablauf feststehen.
Das hochgeladene `module.json` muss bytegleich mit dem Manifest im Release-ZIP sein.
Nicht das automatisch von GitHub erzeugte „Source code.zip“ als Foundry-Paket verwenden.

## Autoren und Kontaktdaten

Genau zwei Einträge: Daniel Brune und ChatGPT/Codex (KI-Unterstützung).
Daniels öffentliche Kontaktdaten werden wie bei TavernGames übernommen:
Website `https://dnd.brunecoaching.de`. Persönliche Kontaktdaten werden nicht veröffentlicht.
 Fremde TavernGames-Regelquellen werden nicht als
Autoren dieses eigenständigen Kartenmoduls übernommen.

## Prüfstand

Vom Nutzer bestätigt auf Foundry 14.369: alle drei Decks importiert, jeweils
59 Karten insgesamt und verfügbar; Ziehen und weitere nicht einzeln benannte
Kartenaktionen funktionierten. Keine getrennte Spieler-Client-Abnahme bestätigt.
Kein eigener Live-Test durch ChatGPT/Codex; keine unbelegte vollständige Verifizierung.


