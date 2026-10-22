export const MODULE_ID = 'dragon-cards-card-deck';
export const CATALOG_URL = `modules/${MODULE_ID}/data/catalog.json`;

/** Read-only catalog access. Never creates or updates Foundry documents. */
export function createApi({fetcher=globalThis.fetch}={}) {
  let pending;
  async function load() {
    if (!pending) pending = (async () => {
      const response = await fetcher(CATALOG_URL);
      if (!response.ok) throw new Error(`Dragon Cards: catalog HTTP ${response.status}`);
      const catalog = await response.json();
      if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.cards) || !Array.isArray(catalog.variants)) {
        throw new Error('Dragon Cards: unsupported catalog schema');
      }
      return catalog;
    })().catch(error => {pending=undefined;throw error;});
    return pending;
  }
  const copy = value => structuredClone(value);
  async function getSet(styleId) {
    const catalog=await load();
    const variant=catalog.variants.find(v=>v.id===styleId);
    if (!variant) throw new RangeError(`Unknown Dragon Cards style: ${styleId}`);
    return copy(variant);
  }
  async function getCard(cardId) {
    const card=(await load()).cards.find(c=>c.id===cardId);
    if (!card) throw new RangeError(`Unknown Dragon Cards card: ${cardId}`);
    return copy(card);
  }
  return Object.freeze({
    apiVersion:1,
    catalogUrl:CATALOG_URL,
    getCatalog:async()=>copy(await load()),
    listSets:async()=>copy((await load()).variants.map(({fronts,...summary})=>summary)),
    getSet,
    getCard,
    getArtwork:async(styleId,cardId)=>{
      const variant=await getSet(styleId);
      await getCard(cardId);
      return {front:`modules/${MODULE_ID}/${variant.fronts[cardId]}`,back:`modules/${MODULE_ID}/${variant.back}`};
    }
  });
}
