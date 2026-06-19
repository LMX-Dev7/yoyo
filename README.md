# YOYO B&M — Menú Digital

> Aplicación web de menú digital con carrito de pedidos vía WhatsApp, diseñada para negocios de jugos, batidos y helados. **Reutilizable para cualquier restaurante o negocio de alimentos.**

---

## Características

- **Diseño Premium y Adaptable**: Interfaz glassmorphic con gradientes, micro-animaciones y optimización para móvil, tablet y PC.
- **Catálogo de Productos Configurable**: Todos los datos del negocio y el menú viven en `js/database.js` — cambia todo editando un solo archivo.
- **Carrito Interactivo**: Añade productos, personaliza opciones (base agua/leche, sabores, toppings), ajusta cantidades y elimina ítems.
- **Pedidos por WhatsApp**: El carrito genera automáticamente un mensaje de texto bien formateado y lo envía al número configurado.
- **SEO Optimizado**: Metatags, Schema.org (JSON-LD) y HTML5 semántico incorporados.
- **Sin dependencias de build**: Funciona directamente en el navegador. No requiere Node.js ni proceso de compilación.

---

## Estructura del Proyecto

```text
yoyo/
├── .gitignore            # Archivos a excluir del control de versiones
├── README.md             # Este documento
├── index.html            # Estructura HTML limpia y semántica
├── css/
│   └── styles.css        # Estilos personalizados, variables de marca y animaciones
└── js/
    ├── database.js       # Configuración del negocio y catálogo de productos
    └── app.js            # Lógica interactiva (navegación, carrito, WhatsApp)
```

---

## Inicio Rápido

Este proyecto es **100% estático**. Para verlo en el navegador:

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd yoyo
   ```
2. Abre `index.html` directamente en tu navegador, **o** usa un servidor local para evitar restricciones de CORS:
   ```bash
   # Con Python 3:
   python -m http.server 8080
   # Con Node.js (npx):
   npx serve .
   ```
3. Accede a `http://localhost:8080` en tu navegador.

---

## Personalización para Otro Negocio

**Solo necesitas editar `js/database.js`:**

### 1. Cambia los datos del negocio

```javascript
const storeConfig = {
  name: "Nombre de tu Negocio",
  tagline: "Tu slogan aquí",
  whatsappPhone: "57XXXXXXXXXX", // Número sin espacios ni signos
  deliveryFee: "Desde $X.XXX a acordar",
  heroImage: "URL de imagen de fondo principal",
  // ...
};
```

### 2. Modifica el menú de categorías

```javascript
categories: [
  {
    id: 'hamburguesas',
    label: 'Hamburguesas',
    icon: '...',    // SVG path
    colorClasses: 'from-amber-100 to-amber-200',
    // ...
  }
]
```

### 3. Añade o modifica productos

```javascript
products: [
  {
    id: 1,
    categoryId: 'hamburguesas',
    type: 'simple',     // 'simple' | 'jugo' | 'helado' | 'malteada' | 'combinado'
    name: 'Clásica',
    description: 'Carne de res, lechuga, tomate y salsas.',
    price: 18000,
    image: 'https://images.unsplash.com/...',
    hasToppings: true,
  }
]
```

---

## Despliegue en Producción con SSL Gratuito

### Opción 1: Netlify (Recomendada)

1. Sube el proyecto a un repositorio de GitHub o GitLab.
2. Accede a [app.netlify.com](https://app.netlify.com) y conecta tu repositorio.
3. Netlify detecta automáticamente el proyecto estático y lo despliega.
4. **SSL/HTTPS gratuito** se activa automáticamente con Let's Encrypt.
5. Para dominio propio: Ve a **Domain Settings > Add custom domain** y añade tu dominio (ej: `yoyobym.com.co`). Netlify configurará automáticamente los registros DNS y el certificado SSL.

### Opción 2: Vercel

1. Instala Vercel CLI: `npm i -g vercel`
2. Desde la raíz del proyecto ejecuta: `vercel`
3. Sigue las instrucciones del asistente. El HTTPS se activa automáticamente.

### Opción 3: GitHub Pages

1. Sube el proyecto a un repositorio público de GitHub.
2. Ve a **Settings > Pages**.
3. Selecciona la rama `main` y la carpeta raíz `/`.
4. GitHub asigna automáticamente un dominio `*.github.io` con HTTPS.
5. Para dominio propio, añade un archivo `CNAME` en la raíz con tu dominio.

---

## Seguridad

| Práctica | Estado |
|---|---|
| HTTPS/SSL | Gestionado por la plataforma de hosting (Netlify/Vercel/GitHub Pages) |
| Sin datos del usuario en servidor | Las direcciones de entrega van directamente a WhatsApp del negocio |
| Variables sensibles | El número de WhatsApp está en `database.js`. Para producción, no expongas datos más críticos en el front-end. |
| Dependencias externas | Solo Tailwind CSS CDN y Google Fonts. Audita versiones regularmente. |
| Content-Security-Policy | Configurable desde los headers de Netlify/Vercel si se requiere nivel más alto. |

---

## Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Variables, animaciones, Flexbox/Grid
- **Tailwind CSS** (CDN) — Clases de utilidad
- **JavaScript ES6+** — Lógica sin frameworks externos
- **Unsplash** — Imágenes de alta calidad (gratuitas para uso comercial con atribución)

---

## Licencia

Proyecto desarrollado para **YOYO B&M**. Puedes reutilizar la estructura como plantilla para otros negocios de alimentos.

---

*Versión 2.0.0 — Barranquilla, Colombia*
