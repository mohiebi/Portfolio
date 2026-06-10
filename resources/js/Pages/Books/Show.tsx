import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/format";
import type { Book } from "@/types";
import { Stars } from "./Index";

type Props = {
  book: Book;
};

export default function BookShow({ book }: Props) {
  const rating = Number(book.reviews_avg_rating ?? 0);

  return (
    <SiteShell>
      <Head title={book.title} />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/books" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to books
        </Link>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">BookReview</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{book.title}</h1>
          <p className="mt-1 text-muted-foreground">by {book.author}</p>
          <div className="mt-4 flex items-center gap-3">
            <Stars value={rating} />
            <span className="font-display text-xl">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">{book.reviews_count ?? 0} reviews</span>
          </div>
          <div className="mt-6">
            <Button asChild>
              <Link href={`/books/${book.id}/reviews/create`}>
                <MessageSquarePlus className="mr-2 h-4 w-4" /> Write a review
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-3">
            {(book.reviews ?? []).map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Reader review</p>
                    {review.created_at && (
                      <>
                        <span aria-hidden="true" className="text-muted-foreground">·</span>
                        <p className="text-xs text-muted-foreground">{formatRelativeDate(review.created_at)}</p>
                      </>
                    )}
                  </div>
                  <Stars value={review.rating} />
                </div>
                <p className="mt-3 text-sm text-foreground/90">{review.review}</p>
              </div>
            ))}
            {(book.reviews ?? []).length === 0 && (
              <p className="rounded-xl border border-dashed border-border bg-surface/40 p-6 text-sm text-muted-foreground">No reviews yet.</p>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
