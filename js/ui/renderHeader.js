export const renderHeader = ({ title, subtitle, backHref = null, cartHref = null, actionLabel = 'Ver carrito' }) => `
  <header class="sticky top-0 z-30 bg-cardBg border-b border-black/5 px-5 py-4">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
      <div class="min-w-0">
        ${backHref ? `<a href="${backHref}" class="inline-flex items-center gap-2 text-sm font-semibold text-textSecondary mb-1">← Volver</a>` : ''}
        <h1 class="text-2xl font-display font-bold text-textPrimary leading-none">${title}</h1>
        ${subtitle ? `<p class="text-sm text-textSecondary mt-1">${subtitle}</p>` : ''}
      </div>
      ${cartHref ? `<a href="${cartHref}" class="btn-primary px-4 py-2 text-sm">${actionLabel}</a>` : ''}
    </div>
  </header>
`;
