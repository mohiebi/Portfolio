import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { formatDocumentTitle, titleFromInertiaPage } from "@/lib/documentTitle";
import { useI18n } from "@/i18n";

type PageLike = {
  component?: string;
  url?: string;
  props?: Record<string, unknown>;
};

export function DocumentTitleSync({ initialPage }: { initialPage: PageLike }) {
  const { locale } = useI18n();
  const [page, setPage] = useState<PageLike>(initialPage);

  useEffect(() => {
    const removeListener = router.on("navigate", (event) => {
      setPage((event as unknown as { detail: { page: PageLike } }).detail.page);
    });

    return () => removeListener();
  }, []);

  useEffect(() => {
    document.title = formatDocumentTitle(titleFromInertiaPage(page, locale), locale);
  }, [locale, page]);

  return null;
}
