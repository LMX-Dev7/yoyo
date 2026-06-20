import { storeConfig } from '../config/store.js';

const preloadImage = (src) => {
  const image = new Image();
  image.src = src;
};

export const initIndexPage = () => {
  const main = document.getElementById('landing-root');

  preloadImage('img/placeholders/logocom.jpeg');
  preloadImage('img/placeholders/logo.svg');
  preloadImage(storeConfig.heroImage);

  if (main) {
    main.innerHTML = `
      <section id="view-home" class="view-section hero-section" aria-label="Pantalla de inicio">
        <div id="hero-bg" class="hero-bg" role="img" aria-label="Jugos y batidos naturales frescos"></div>
        <div class="hero-content">
          <img class="hero-logo" src="img/placeholders/logo.svg" alt="${storeConfig.name}" loading="eager" decoding="async" fetchpriority="high">
          <a id="btn-cta" class="btn-primary btn-primary--delivery font-display py-4 px-8 text-xl mt-6" href="menu.html">
            <span>Pedir domicilio</span>
          </a>
          <div class="hero-hours-badge" aria-label="Horario de atención">
            <span>${storeConfig.openingHours}</span>
          </div>
        </div>
      </section>
    `;
    const bg = document.getElementById('hero-bg');
    if (bg) bg.style.backgroundImage = `url('${storeConfig.heroImage}')`;
  }
};
