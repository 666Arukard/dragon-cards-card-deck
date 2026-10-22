import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath, pathToFileURL} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read = file => JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

export function resolveAsset(relative) {
  assert.equal(typeof relative,'string');
  assert.match(relative,/^assets\/[A-Za-z0-9_./-]+\.webp$/);
  assert(!relative.split('/').includes('..'));
  const resolved=path.resolve(root,relative);
  assert(resolved.startsWith(root+path.sep));
  assert(fs.statSync(resolved).isFile());
  return resolved;
}
export function webpSize(file) {
  const b=fs.readFileSync(file);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
  for(let p=12;p+8<=b.length;) {
    const kind=b.toString('ascii',p,p+4),size=b.readUInt32LE(p+4),data=p+8;
    if(kind==='VP8X')return [b.readUIntLE(data+4,3)+1,b.readUIntLE(data+7,3)+1];
    if(kind==='VP8L') {assert.equal(b[data],0x2f);const n=b.readUInt32LE(data+1);return [(n&0x3fff)+1,((n>>>14)&0x3fff)+1];}
    if(kind==='VP8 ')return [b.readUInt16LE(data+6)&0x3fff,b.readUInt16LE(data+8)&0x3fff];
    p=data+size+(size%2);
  }
  throw Error('No WebP image chunk: '+file);
}
export function validate() {
 const manifest=read('module.json'),catalog=read('data/catalog.json'),inventory=read('data/source-inventory.json');
 const id=manifest.id;
 assert.equal(id,'dragon-cards-card-deck');assert.equal(manifest.compatibility.minimum,'14');assert.equal(manifest.compatibility.verified,'14.369');assert(!('maximum' in manifest.compatibility));
 assert(!manifest.relationships?.requires?.length);assert.equal(manifest.packs.length,1);assert.equal(manifest.packs[0].type,'Cards');
 assert(fs.existsSync(path.join(root,manifest.packs[0].path,'CURRENT')));
 assert.equal(catalog.cards.length,59);assert.equal(catalog.variants.length,3);
 const ids=catalog.cards.map(c=>c.id);assert.equal(new Set(ids).size,59);
 assert.equal(catalog.cards.filter(c=>c.jokerKind===null).length,52);
 assert.equal(catalog.cards.filter(c=>c.jokerKind==='suited').length,4);
 assert.equal(catalog.cards.filter(c=>c.jokerKind==='independent').length,3);
 for(const s of ['hearts','clubs','spades','diamonds']) {
   const cards=catalog.cards.filter(c=>c.standardSuit===s);assert.equal(cards.length,14);
   assert.deepEqual(cards.map(c=>c.standardRank).sort(),['2','3','4','5','6','7','8','9','10','jack','queen','king','ace','joker'].sort());
 }
 const distinctBacks=new Set(),nativeIds=new Map();let frontCount=0;
 for(const v of catalog.variants) {
  assert.equal(v.cardCount,59);assert.deepEqual(Object.keys(v.fronts).sort(),[...ids].sort());
  const source=inventory.variants.find(x=>x.styleId===v.id);assert(source);
  const expected=new Map(source.files.map(x=>[x.file,x.sha256]));
  for(const rel of [...Object.values(v.fronts),v.back]) {
    const file=resolveAsset(rel);assert.deepEqual(webpSize(file),[1000,1500]);
    const sourceName=rel===v.back?'Rueckseite.webp':path.basename(rel);
    assert.equal(hash(fs.readFileSync(file)),expected.get(sourceName),'Source changed: '+rel);
  }
  distinctBacks.add(v.back);frontCount+=Object.keys(v.fronts).length;
  const deck=read(`data/decks/${v.id}.json`);
  assert.equal(deck.type,'deck');assert.equal(deck.cards.length,59);assert.equal(deck.ownership.default,0);
  assert.equal(deck._id,v.extensions[id].documentId);assert.match(deck._id,/^[A-Za-z0-9]{16}$/);
  assert.equal(deck.img,`modules/${id}/${v.back}`);
  assert.equal(deck.flags[id].styleId,v.id);
  assert.equal(new Set(deck.cards.map(c=>c._id)).size,59);
  assert.deepEqual(deck.cards.map(c=>c.flags[id].cardId).sort(),[...ids].sort());
  for(const c of deck.cards) {
    const logical=catalog.cards.find(x=>x.id===c.flags[id].cardId);assert(logical);
    assert.equal(c.type,'base');assert.equal(c.name,logical.displayName);assert.equal(c.suit,logical.standardSuit??'');assert.equal(c.value,logical.rankSort);
    assert.equal(c.drawn,false);assert.equal(c.face,0);assert(!c.origin);assert.equal(c.faces.length,1);
    assert.equal(c.faces[0].img,`modules/${id}/${v.fronts[logical.id]}`);assert.equal(c.back.img,`modules/${id}/${v.back}`);
    assert.equal(c.flags[id].styleId,v.id);assert.equal(c.flags[id].standardRank,logical.standardRank);assert.equal(c.flags[id].jokerKind,logical.jokerKind);
    assert.match(c._id,/^[A-Za-z0-9]{16}$/);
    if(nativeIds.has(logical.id))assert.equal(c._id,nativeIds.get(logical.id));else nativeIds.set(logical.id,c._id);
  }
 }
 assert.equal(frontCount,177);assert.equal(distinctBacks.size,3);assert.equal(inventory.uniqueBacks,3);
 for(const file of ['README.md','CHANGELOG.md','LICENSE.md','LICENSE-CODE.md','LICENSE-ARTWORK.md','docs/METADATA.md','docs/TESTS.md','docs/SOURCES.md','data/catalog.schema.json'])assert(fs.statSync(path.join(root,file)).isFile());
 return {checkedOn:'2026-10-22',targetFoundry:'14',referenceApi:'14.368',verifiedFoundry:manifest.compatibility.verified,verificationBasis:'Daniel Brune user test; see docs/user-test-evidence.json',variantCount:3,cardsPerVariant:59,regularPerVariant:52,suitedJokersPerVariant:4,independentJokersPerVariant:3,frontFiles:177,distinctBackFiles:3,stableLogicalAndEmbeddedIds:true,relativePathsAndImageDimensions:true,sourceAssetHashesUnchanged:true,sourceAssetsReadOnly:true,nativeRuntimeTests:{import:'not executed by agent',shuffle:'not executed by agent',deal:'not executed by agent',draw:'not executed by agent',recall:'not executed by agent',playerHands:'not executed by agent'},userEvidence:'docs/user-test-evidence.json'};
}
if(process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url) {
 const report=validate();fs.writeFileSync(path.join(root,'docs/validation-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
