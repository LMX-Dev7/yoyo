export const $ = (id, root = document) => root.getElementById(id);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
});

export const formatMoney = (value) => COP.format(value);
