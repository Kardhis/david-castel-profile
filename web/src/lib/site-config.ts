/** Edita estos valores con tus datos reales y redes. */
export const siteConfig = {
  name: "David Castel",
  role: "Full Stack Product Engineer",
  /** Email de contacto (mailto). */
  email: "contact@example.com",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
} as const;

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}
