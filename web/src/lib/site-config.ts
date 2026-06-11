/** Ruta bajo la que se sirve la app en producción (debe coincidir con `basePath` en next.config). */
export const basePath = "/profile" as const;

/** Prefija rutas de `public/` para `<img>` y el optimizador con `basePath`. */
export function withBasePath(assetPath: string): string {
  const normalized = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  if (normalized === basePath || normalized.startsWith(`${basePath}/`)) {
    return normalized;
  }
  return `${basePath}${normalized}`;
}

/** Edita estos valores con tus datos reales y redes. */
export const siteConfig = {
  name: "David Castel",
  role: "Full Stack Product Engineer",
  /** Email de contacto (mailto). */
  email: "davidcastelcastells@gmail.com",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
} as const;

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    `http://localhost:3001${basePath}`
  );
}
