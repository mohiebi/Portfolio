import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";

type Props = {
  book: Book;
};

export default function ReviewCreate({ book }: Props) {
  const form = useForm({
    review: "",
    rating: "5",
  });
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <SiteShell>
      <Head title={`Review ${book.title}`} />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href={`/books/${book.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to book
        </Link>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">Write a review</h1>
          <p className="mt-1 text-sm text-muted-foreground">{book.title}</p>
          <form className="mt-6 grid gap-5" onSubmit={(event) => { event.preventDefault(); form.post(`/books/${book.id}/reviews`); }}>
            <div className="grid gap-1.5">
              <Label id="rating-label">Rating</Label>
              <div role="radiogroup" aria-labelledby="rating-label" className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(null)}>
                {[1, 2, 3, 4, 5].map((value) => {
                  const filled = value <= (hoveredRating ?? Number(form.data.rating));
                  return (
                    <label
                      key={value}
                      className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
                      onMouseEnter={() => setHoveredRating(value)}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={Number(form.data.rating) === value}
                        onChange={() => form.setData("rating", String(value))}
                        className="sr-only"
                      />
                      <Star aria-hidden="true" className={cn("h-7 w-7 transition-colors", filled ? "fill-primary text-primary" : "text-muted-foreground/40")} />
                      <span className="sr-only">{value} {value === 1 ? "star" : "stars"}</span>
                    </label>
                  );
                })}
              </div>
              {form.errors.rating && <p className="text-sm text-destructive">{form.errors.rating}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="review">Review</Label>
              <Textarea id="review" rows={7} value={form.data.review} onChange={(event) => form.setData("review", event.target.value)} />
              {form.errors.review && <p className="text-sm text-destructive">{form.errors.review}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button asChild variant="ghost"><Link href={`/books/${book.id}`}>Cancel</Link></Button>
              <Button disabled={form.processing}>Publish review</Button>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
