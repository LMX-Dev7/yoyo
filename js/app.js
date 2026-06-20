import { initIndexPage } from './pages/index.page.js';
import { initMenuPage } from './pages/menu.page.js';
import { initCarritoPage } from './pages/carrito.page.js';
import { escapeHtml } from './security/sanitize.js';

const page = document.body?.dataset?.page || '';
const navEntry = performance.getEntriesByType?.('navigation')?.[0];
const isReload = navEntry ? navEntry.type === 'reload' : performance.navigation?.type === 1;

const showFatalError = (message) => {
  const root = document.querySelector('main') || document.body;
  if (root) {
    root.innerHTML = `
      <section class="min-h-[50vh] flex items-center justify-center p-6">
        <div class="max-w-md w-full rounded-3xl bg-white border border-black/5 p-6 text-center">
          <h1 class="font-display text-3xl font-bold text-textPrimary mb-2">Algo no cargo bien</h1>
          <p class="text-sm text-textSecondary">${escapeHtml(message)}</p>
        </div>
      </section>
    `;
  }
};

if (isReload && page !== 'home') {
  window.location.replace('index.html');
}

document.addEventListener('DOMContentLoaded', async () => {
  if (isReload && page !== 'home') return;

  try {
    if (page === 'home') await initIndexPage();
    if (page === 'menu') await initMenuPage();
    if (page === 'carrito') await initCarritoPage();
  } catch {
    showFatalError('No se pudieron cargar los datos de la tienda.');
  }
});
