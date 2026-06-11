# Portfolio web (Next.js)

Aplicación del portfolio de David Castel: **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **next-intl** (ES/EN), **Framer Motion**, SEO base (metadata, `sitemap.xml`, `robots.txt`, JSON-LD).

## Requisitos

- Node.js 20+
- Espacio en disco suficiente para `npm install` (si ves `ENOSPC`, libera espacio y vuelve a ejecutar el install).

## Puesta en marcha

```bash
cd web
npm install
npm run dev
```

Abre [http://localhost:3000/profile](http://localhost:3000/profile): redirige a `/profile/es`.

## Variables de entorno

Copia [`.env.example`](.env.example) a `.env.local` y define:

- `NEXT_PUBLIC_SITE_URL` — URL canónica del sitio (sin barra final), incluyendo el `basePath`. En producción: `http://168.231.84.188/profile`.

La app se sirve bajo **`/profile`** (`basePath` en [`next.config.ts`](next.config.ts), definido en [`src/lib/site-config.ts`](src/lib/site-config.ts)).

## Contenido y assets

- **Email y redes:** edita [`src/lib/site-config.ts`](src/lib/site-config.ts).
- **Textos bilingües:** [`src/messages/es.json`](src/messages/es.json) y [`src/messages/en.json`](src/messages/en.json).
- **Imagen hero:** coloca `hero.jpg` en [`public/`](public/) (ver [`public/HERO-README.txt`](public/HERO-README.txt)).

## Scripts

| Comando     | Descripción        |
| ----------- | ------------------ |
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción |
| `npm run start` | Servidor producción |
| `npm run lint` | ESLint |

## Estructura destacada

- `src/app/[locale]/` — páginas por idioma
- `src/i18n/` — routing y `request` de next-intl
- `src/middleware.ts` — prefijo de locale
- `src/components/` — UI (hero con `next/image`, secciones, CTA flotante)
