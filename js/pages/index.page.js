import { getStoreConfig } from '../data-access/dataProvider.js';
import { escapeHtml } from '../security/sanitize.js';

const preloadImage = (src) => {
  const image = new Image();
  image.src = src;
};

export const initIndexPage = async () => {
  const storeConfig = await getStoreConfig();
  const main = document.getElementById('landing-root');

  preloadImage('img/placeholders/logocom.jpeg');
  preloadImage('img/placeholders/logo.svg');
  preloadImage(storeConfig.heroImage);

  if (main) {
    main.innerHTML = `
      <section id="view-home" class="view-section hero-section" aria-label="Pantalla de inicio">
        <div id="hero-bg" class="hero-bg" role="img" aria-label="Jugos y batidos naturales frescos"></div>
        <div class="hero-content">
          <h1 class="sr-only">${escapeHtml(storeConfig.name)} | Jugos naturales, batidos y helados en Barranquilla</h1>
          <img class="hero-logo" src="img/placeholders/logo.svg" alt="${escapeHtml(storeConfig.name)}" width="220" height="214" loading="eager" decoding="async" fetchpriority="high">
          <a id="btn-cta" class="btn-primary btn-primary--delivery font-display w-full max-w-[340px] py-2.5 px-10 text-xl mt-6" href="menu.html">
            <span>Pedir domicilio</span>
          </a>
          <div class="hero-hours-badge" aria-label="Horario de atención">
            <span>${escapeHtml(storeConfig.openingHours)}</span>
          </div>
        </div>
      </section>
    `;
    const bg = document.getElementById('hero-bg');
    if (bg) bg.style.backgroundImage = `url('${storeConfig.heroImage}')`;
  }
};
