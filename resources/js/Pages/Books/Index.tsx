import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { BookOpen, Search, Star } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { PaginationNav } from "@/components/site/PaginationNav";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { Book, PaginatedData } from "@/types";

type Props = {
  books: PaginatedData<Book>;
  filters: {
    title?: string;
    filter?: string;
  };
};

const filters = [
  { value: "", label: "Latest" },
  { value: "popular_last_month", label: "Popular / 1mo" },
  { value: "popular_last_6_months", label: "Popular / 6mo" },
  { value: "highest_rated_last_month", label: "Top rated / 1mo" },
  { value: "highest_rated_last_6_months", label: "Top rated / 6mo" },
];

function ratingOf(book: Book) {
  return Number(book.reviews_avg_rating ?? 0);
}

export function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden="true" className={`h-3.5 w-3.5 ${n <= Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
      ))}
    </div>
  );
}

export default function BooksIndex({ books, filters: current }: Props) {
  const [search, setSearch] = useState(current.title ?? "");

  const visit = (next: Record<string, string>) => {
    router.get("/books", { ...current, ...next }, { preserveScroll: true, preserveState: true, replace: true });
  };

  const debouncedSearch = useDebouncedCallback((value: string) => visit({ title: value }), 300);

  return (
    <SiteShell>
      <Head title="BookReview" />
      <PageHeader eyebrow="Project / BookReview" title="Browse books" description="Search the catalog and filter by popularity or rating." />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                debouncedSearch(event.target.value);
              }}
              placeholder="Search by title..."
              aria-label="Search by title"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => visit({ filter: filter.value })}
                aria-pressed={(current.filter ?? "") === filter.value}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  (current.filter ?? "") === filter.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {books.data.length === 0 ? (
          <div className="mt-10">
            <EmptyState icon={BookOpen} title="No books found" description="Try a different search term or clear the filter." />
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-muted-foreground">{books.total} {books.total === 1 ? "book" : "books"} found</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.data.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">BookReview</p>
                  <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold group-hover:text-primary">{book.title}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <Stars value={ratingOf(book)} />
                    <span>{ratingOf(book).toFixed(1)}</span>
                    <span className="text-muted-foreground">/ {book.reviews_count ?? 0} reviews</span>
                  </div>
                </Link>
              ))}
            </div>
            <PaginationNav links={books.links} />
          </>
        )}
      </section>
    </SiteShell>
  );
}
