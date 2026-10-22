import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Optional explicit tooling entry point for building without putting node_modules in the release.
const cli=process.env.DRAGON_CARDS_CLI_ENTRY
  ? await import(pathToFileURL(path.resolve(process.env.DRAGON_CARDS_CLI_ENTRY)).href)
  : await import('@foundryvtt/foundryvtt-cli');
const pack='dragon-decks';
await cli.compilePack(path.join(root,'pack-source',pack),path.join(root,'packs',pack));
if (!fs.existsSync(path.join(root,'packs',pack,'CURRENT'))) throw new Error('LevelDB pack not created');
console.log('Official Foundry CLI: LevelDB pack compiled.');
