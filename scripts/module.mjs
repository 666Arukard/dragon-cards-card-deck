import {createApi, MODULE_ID} from './api.mjs';

// Expose read-only metadata access; no world-document operations or automatic imports.
Hooks.once('init', () => {
  const module=game.modules.get(MODULE_ID);
  if (module) module.api=createApi();
});
