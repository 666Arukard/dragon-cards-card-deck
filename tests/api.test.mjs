import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createApi,CATALOG_URL} from '../scripts/api.mjs';
import {validate} from '../tools/validate.mjs';
const catalog=JSON.parse(fs.readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8'));

test('Complete release has 3 equivalent decks and original assets',()=>validate());
test('Read-only API caches reads and returns isolated metadata',async()=>{
 let reads=0;
 const api=createApi({fetcher:async(url)=>{assert.equal(url,CATALOG_URL);reads++;return {ok:true,json:async()=>structuredClone(catalog)};}});
 const [sets,cards]=await Promise.all([api.listSets(),api.getCatalog()]);
 assert.equal(reads,1);assert.equal(sets.length,3);assert.equal(cards.cards.length,59);
 cards.cards[0].displayName='Changed';sets[0].name='Changed';
 assert.notEqual((await api.getCatalog()).cards[0].displayName,'Changed');
 assert.notEqual((await api.listSets())[0].name,'Changed');
 for(const style of sets.map(s=>s.id))for(const card of catalog.cards) {
   const art=await api.getArtwork(style,card.id);
   assert(art.front.startsWith('modules/dragon-cards-card-deck/assets/fronts/'));
   assert(art.back.startsWith('modules/dragon-cards-card-deck/assets/backs/'));
 }
 assert.equal(reads,1);assert(Object.isFrozen(api));
 await assert.rejects(api.getSet('absent'),RangeError);
 await assert.rejects(api.getCard('absent'),RangeError);
});
test('API retries after HTTP failure and rejects unsupported schemas',async()=>{
 let reads=0;const api=createApi({fetcher:async()=>++reads===1?{ok:false,status:503}:{ok:true,json:async()=>structuredClone(catalog)}});
 await assert.rejects(api.getCatalog(),/503/);assert.equal((await api.listSets()).length,3);assert.equal(reads,2);
 const invalid=createApi({fetcher:async()=>({ok:true,json:async()=>({schemaVersion:99})})});
 await assert.rejects(invalid.getCatalog(),/schema/);
});
test('Foundry init hook exposes only an API; no world operations',()=>{
 let hook,callback,reads=0;const module={};
 const source=fs.readFileSync(new URL('../scripts/module.mjs',import.meta.url),'utf8').replace(/^import .*;\s*/,'');
 const world=new Proxy({},{get(){throw Error('Unexpected world access');},set(){throw Error('Unexpected world mutation');}});
 vm.runInNewContext(source,{MODULE_ID:'dragon-cards-card-deck',createApi:()=>{reads++;return {readOnly:true};},Hooks:{once:(name,fn)=>{hook=name;callback=fn;}},game:{modules:{get:()=>module},cards:world}});
 assert.equal(hook,'init');assert.equal(reads,0);callback();assert.deepEqual({...module.api},{readOnly:true});assert.equal(reads,1);
});
