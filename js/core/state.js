export const state = {
  cart: [],
  currentProduct: null,
  livePrice: 0,
  lastCategoryId: 'jugos',
};

export const setState = (patch) => Object.assign(state, patch);
