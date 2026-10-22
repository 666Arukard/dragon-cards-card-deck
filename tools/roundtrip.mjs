import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=process.env.DRAGON_CARDS_CLI_ENTRY
 ? await import(pathToFileURL(path.resolve(process.env.DRAGON_CARDS_CLI_ENTRY)).href)
 : await import('@foundryvtt/foundryvtt-cli');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dragon-cards-roundtrip-'));
function canonical(deck) {
 const d=structuredClone(deck);delete d._key;
 for(const c of d.cards) {
  delete c._key;
  // The official CLI also applies the cards collection hierarchy to embedded Card
  // documents. Its empty synthetic child collection is not part of CardData.
  if(Array.isArray(c.cards)&&c.cards.length===0)delete c.cards;
 }
 return d;
}
await cli.extractPack(path.join(root,'packs/dragon-decks'),tmp);
const actual=fs.readdirSync(tmp).filter(x=>x.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(tmp,f),'utf8')));
assert.equal(actual.length,3);
const variants=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8')).variants;
let embedded=0;
for(const v of variants) {
 const expected=JSON.parse(fs.readFileSync(path.join(root,`data/decks/${v.id}.json`),'utf8'));
 const doc=actual.find(d=>d._id===expected._id);assert(doc);assert.equal(doc.cards.length,59);
 assert.deepEqual(canonical(doc),canonical(expected));embedded+=doc.cards.length;
}
const report={checkedOn:'2026-10-22',tool:'@foundryvtt/foundryvtt-cli',toolVersion:'3.0.5',format:'LevelDB',deckDocuments:actual.length,embeddedCards:embedded,roundTripMatches:true,emptyCliChildCollectionsIgnored:true,foundryRuntimeTest:false};
fs.writeFileSync(path.join(root,'docs/pack-roundtrip-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
// Only remove files created by this run, never recursively delete a computed path.
for(const file of fs.readdirSync(tmp))fs.unlinkSync(path.join(tmp,file));fs.rmdirSync(tmp);
