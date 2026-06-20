import { initIndexPage } from './pages/index.page.js';
import { initMenuPage } from './pages/menu.page.js';
import { initCarritoPage } from './pages/carrito.page.js';

const page = document.body?.dataset?.page || '';
const navEntry = performance.getEntriesByType?.('navigation')?.[0];
const isReload = navEntry ? navEntry.type === 'reload' : performance.navigation?.type === 1;

if (isReload && page !== 'home') {
  window.location.replace('index.html');
}

document.addEventListener('DOMContentLoaded', () => {
  if (isReload && page !== 'home') return;
  if (page === 'home') initIndexPage();
  if (page === 'menu') initMenuPage();
  if (page === 'carrito') initCarritoPage();
});
