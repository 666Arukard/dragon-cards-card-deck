const ID='dragon-cards-card-deck';
const check=(condition,message)=>{if(!condition)throw new Error(message);};

/** Manually invoked only. Creates isolated test documents, never changes existing decks. */
export async function runGmSmokeTest({playerUserId=null,cleanup=true}={}) {
 check(game.user.isGM,'This test must be started by a GM.');
 const player=playerUserId?game.users.get(playerUserId):null;
 if(playerUserId)check(player&&!player.isGM,'Select an existing non-GM test player.');
 const catalog=await game.modules.get(ID).api.getCatalog();
 const pack=game.packs.get(`${ID}.dragon-decks`);check(pack,'Compendium unavailable.');
 const runId=foundry.utils.randomID();const created=[];const results=[];
 const CardsClass=game.cards.documentClass;
 try {
  for(const variant of catalog.variants) {
   const sourceId=variant.extensions[ID].documentId;
   const source=await pack.getDocument(sourceId);check(source,'Deck not found in compendium.');
   const beforeIds=new Set(game.cards.contents.map(d=>d.id));
   const deck=await game.cards.importFromCompendium(pack,sourceId,{
    name:`[Dragon Cards TEST ${runId}] ${variant.id}`,
    ownership:{default:0},
    flags:{[ID]:{...source.flags[ID],smokeTest:runId}}
   },{keepId:false});
   check(deck&&!beforeIds.has(deck.id),'Import must create a fresh world deck.');created.push(deck);
   check(deck.cards.size===59&&deck.availableCards.length===59,'Import must contain 59 available cards.');
   const hand=await CardsClass.create({name:`[Dragon Cards TEST ${runId}] hand`,type:'hand',ownership:player?{default:0,[player.id]:3}:{default:0},flags:{[ID]:{smokeTest:runId}}});created.push(hand);
   const other=await CardsClass.create({name:`[Dragon Cards TEST ${runId}] other hand`,type:'hand',ownership:{default:0},flags:{[ID]:{smokeTest:runId}}});created.push(other);
   await deck.shuffle({chatNotification:false});
   check(deck.availableCards.length===59,'Shuffle changed card count.');
   await deck.deal([hand,other],2,{chatNotification:false,updateData:{face:0}});
   check(hand.cards.size===2&&other.cards.size===2&&deck.availableCards.length===55,'Deal counts incorrect.');
   await hand.draw(deck,1,{updateData:{face:0}});
   check(hand.cards.size===3&&deck.availableCards.length===54,'Draw counts incorrect.');
   for(const card of [...hand.cards.contents,...other.cards.contents]) {
    const logicalId=card.getFlag(ID,'cardId');
    check(variant.fronts[logicalId],'Logical ID was lost in transfer.');
    check(card.faces[0].img===`modules/${ID}/${variant.fronts[logicalId]}`,'Wrong face after transfer.');
    check(card.back.img===`modules/${ID}/${variant.back}`,'Wrong back after transfer.');
   }
   let permissions='not tested: no playerUserId provided';
   if(player) {
    check(hand.testUserPermission(player,'OWNER'),'Player is not owner of their own hand.');
    check(!other.testUserPermission(player,'LIMITED'),'Player can see another private test hand.');
    check(!deck.testUserPermission(player,'OWNER'),'Player must not own the deck.');
    permissions='GM-side permission checks passed; player-client actions still require a second login';
   }
   await deck.recall({chatNotification:false,updateData:{face:null}});
   check(deck.availableCards.length===59&&hand.cards.size===0&&other.cards.size===0,'Recall/reset counts incorrect.');
   results.push({styleId:variant.id,import:true,shuffle:true,deal:true,draw:true,recall:true,permissions});
  }
  const report={foundryVersion:game.version??game.release?.version,runId,results};console.table(results);return report;
 } finally {
  if(cleanup)for(const doc of [...created].reverse()) {
   if(game.cards.has(doc.id)&&doc.getFlag(ID,'smokeTest')===runId)await doc.delete();
  }
 }
}
