const loadJson = async (relativePath) => {
  const response = await fetch(new URL(relativePath, import.meta.url), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${relativePath}: ${response.status}`);
  }
  return response.json();
};

let storeConfigPromise;
let categoriesPromise;
let productsPromise;

export const getStoreConfig = () => {
  storeConfigPromise ||= loadJson('../../data/store-config.json');
  return storeConfigPromise;
};

export const getCategories = () => {
  categoriesPromise ||= loadJson('../../data/categories.json');
  return categoriesPromise;
};

export const getProducts = () => {
  productsPromise ||= loadJson('../../data/products.json');
  return productsPromise;
};

export const getStoreCatalog = async () => {
  const [storeConfig, categories, products] = await Promise.all([
    getStoreConfig(),
    getCategories(),
    getProducts(),
  ]);

  return { storeConfig, categories, products };
};
