import { Head, usePage } from "@inertiajs/react";
import { useMemo, type ReactNode } from "react";
import { useI18n } from "@/i18n";

type SeoHeadProps = {
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  robots?: string;
  children?: ReactNode;
};

const SITE_NAME = "Mohi";
const DEFAULT_IMAGE = "/img/og-preview.webp";

export function SeoHead({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index,follow",
  children,
}: SeoHeadProps) {
  const page = usePage();
  const { locale } = useI18n();
  const { canonical, alternates } = useMemo(() => seoUrls(page.url, locale), [page.url, locale]);
  const fullTitle = title.startsWith(`${SITE_NAME} -`) ? title : `${SITE_NAME} - ${title}`;
  const imageUrl = absoluteUrl(image || DEFAULT_IMAGE);

  return (
    <Head title={title}>
      <meta key="description" name="description" content={description} />
      <meta key="robots" name="robots" content={robots} />
      <link key="canonical" rel="canonical" href={canonical} />
      <link key="alternate-en" rel="alternate" hrefLang="en" href={alternates.en} />
      <link key="alternate-de" rel="alternate" hrefLang="de" href={alternates.de} />
      <link key="alternate-default" rel="alternate" hrefLang="x-default" href={alternates.default} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:locale" property="og:locale" content={locale === "de" ? "de_DE" : "en_US"} />
      <meta key="og:url" property="og:url" content={canonical} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:image" property="og:image" content={imageUrl} />
      <meta key="og:image:secure_url" property="og:image:secure_url" content={imageUrl} />
      <meta key="og:image:alt" property="og:image:alt" content={title} />
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={fullTitle} />
      <meta key="twitter:description" name="twitter:description" content={description} />
      <meta key="twitter:image" name="twitter:image" content={imageUrl} />
      <meta key="twitter:image:alt" name="twitter:image:alt" content={title} />
      {children}
    </Head>
  );
}

function seoUrls(pageUrl: string, locale: string) {
  const parsed = new URL(pageUrl, "https://mohiebi.com");
  const path = parsed.pathname === "/recommendations/all" ? "/recommendations" : parsed.pathname;
  const canonical = absoluteUrl(`${path}${locale === "de" ? "?lang=de" : ""}`);

  return {
    canonical,
    alternates: {
      en: absoluteUrl(path),
      de: absoluteUrl(`${path}?lang=de`),
      default: absoluteUrl(path),
    },
  };
}

function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const origin = typeof window === "undefined" ? "https://mohiebi.com" : window.location.origin;
  const normalized = value.startsWith("/") ? value : `/${value}`;

  return `${origin}${normalized}`;
}
