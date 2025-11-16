// path: src/layouts/register.js - adapted from typescript

//import { App } from 'vue';
//import { ModuleNamespace } from 'vite/types/hot';

/**
 * Register layouts in the app instance
 *
 * @param {App} app
 */
export function registerLayouts(app) {
  // ALT (funktioniert nicht mehr):
  //const layouts = import.meta.globEager('./*.vue');
  const layouts = import.meta.glob('./*.vue', { eager: true })

  Object.entries(layouts).forEach(([, layout]) => {
    app.component(layout?.default?.name, layout?.default);
  });
}
