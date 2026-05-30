import { Head, Link, router, useForm } from "@inertiajs/react";
import { ChangeEvent, useState } from "react";
import { Image, Trash2, Upload } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/types";

interface Props {
  listing: Listing;
}

export default function RealtorImageCreate({ listing }: Props) {
  const form = useForm<{ images: File[] }>({ images: [] });
  const [progress, setProgress] = useState<number | null>(null);

  router.on("progress", (event) => {
    const pct = (event as CustomEvent).detail?.progress?.percentage;
    if (pct) setProgress((pct / 100) * 90);
  });

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    form.setData("images", [...form.data.images, ...Array.from(e.target.files)]);
  };

  const upload = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(route("realtor.listing.image.store", { listing: listing.id }), {
      onSuccess: () => { form.reset(); setProgress(null); },
    });
  };

  const imageErrors = Object.values(form.errors);

  return (
    <SiteShell>
      <Head title="Listing Images" />
      <PageHeader eyebrow="Realtor Dashboard" title="Listing Images" />

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href={route("realtor.listing.index")} className="text-sm text-muted-foreground hover:text-foreground">← Back to listings</Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <p className="text-xs font-mono uppercase tracking-wider text-primary mb-4">Upload New Images</p>
          <form onSubmit={upload}>
            <div className="flex items-center gap-3">
              <input
                type="file" multiple onChange={addFiles}
                className="rounded-md border border-border text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-accent"
              />
              <Button type="submit" disabled={form.data.images.length === 0 || form.processing}>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
              <Button type="button" variant="outline" onClick={() => form.setData("images", [])}>Reset</Button>
            </div>

            {progress !== null && (
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}

            {imageErrors.length > 0 && (
              <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {imageErrors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}
          </form>
        </div>

        {listing.images && listing.images.length > 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-mono uppercase tracking-wider text-primary mb-4">Current Images</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {listing.images.map((img) => (
                <div key={img.id} className="flex flex-col gap-2">
                  <img src={img.src} alt="Listing" className="aspect-video w-full rounded-lg object-cover" />
                  <Link
                    href={route("realtor.listing.image.destroy", { listing: listing.id, image: img.id })}
                    method="delete" as="button"
                    className="flex items-center justify-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border">
            <div className="text-center text-muted-foreground"><Image className="mx-auto mb-2 h-8 w-8" /><p className="text-sm">No images yet</p></div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
