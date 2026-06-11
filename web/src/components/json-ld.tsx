import { getSiteUrl, siteConfig } from "@/lib/site-config";

type Props = { locale: string };

export function JsonLd({ locale }: Props) {
  const base = getSiteUrl();
  const url = `${base}/${locale}`;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url,
    sameAs: [siteConfig.linkedin, siteConfig.github].filter(Boolean),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteConfig.name} — ${siteConfig.role}`,
    url: base,
    inLanguage: locale,
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
