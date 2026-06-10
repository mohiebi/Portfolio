import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginatedData } from "@/types";

type PaginationLink = PaginatedData<unknown>["links"][number];

export function PaginationNav({ links }: { links: PaginationLink[] }) {
  if (links.length <= 3) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-center gap-1">
      {links.map((link, index) => {
        const isPrev = index === 0;
        const isNext = index === links.length - 1;
        const label = isPrev ? "Previous page" : isNext ? "Next page" : `Page ${link.label}`;
        const content = isPrev ? (
          <ChevronLeft className="h-4 w-4" />
        ) : isNext ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          link.label
        );

        if (!link.url) {
          return (
            <span
              key={index}
              aria-hidden="true"
              className="grid h-9 min-w-9 place-items-center rounded-md border border-border px-3 text-sm text-muted-foreground opacity-40"
            >
              {content}
            </span>
          );
        }

        return (
          <Link
            key={index}
            href={link.url}
            preserveScroll
            aria-label={label}
            aria-current={link.active ? "page" : undefined}
            className={`grid h-9 min-w-9 place-items-center rounded-md border px-3 text-sm transition-colors ${
              link.active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
