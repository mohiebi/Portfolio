import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { Bath, Bed, Building2, Image, Maximize2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Listing, PaginatedData } from "@/types";

interface Filters {
  deleted?: boolean;
  by?: string;
  order?: string;
}

interface Props {
  listings: PaginatedData<Listing>;
  filters: Filters;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export default function RealtorIndex({ listings, filters }: Props) {
  const [form, setForm] = useState({
    deleted: filters.deleted ?? false,
    by: filters.by ?? "created_at",
    order: filters.order ?? "desc",
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      router.get(route("realtor.listing.index"), form, { preserveState: true, preserveScroll: true, replace: true });
    }, 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [form]);

  const sortLabels: Record<string, Array<{ label: string; value: string }>> = {
    created_at: [{ label: "Latest", value: "desc" }, { label: "Oldest", value: "asc" }],
    price: [{ label: "Pricey", value: "desc" }, { label: "Cheapest", value: "asc" }],
    beds: [{ label: "Most", value: "desc" }, { label: "Least", value: "asc" }],
    baths: [{ label: "Most", value: "desc" }, { label: "Least", value: "asc" }],
  };

  return (
    <SiteShell>
      <Head title="My Listings" />
      <PageHeader eyebrow="Realtor Dashboard" title="Your Listings">
        <Link href={route("realtor.listing.create")}>
          <Button><Plus className="mr-2 h-4 w-4" /> New Listing</Button>
        </Link>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox" checked={form.deleted}
              onChange={(e) => setForm((f) => ({ ...f, deleted: e.target.checked }))}
              className="h-4 w-4 rounded border-border"
            />
            Show deleted
          </label>

          <select
            value={form.by}
            onChange={(e) => setForm((f) => ({ ...f, by: e.target.value, order: "desc" }))}
            className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm"
          >
            <option value="created_at">Date added</option>
            <option value="price">Price</option>
            <option value="beds">Beds</option>
            <option value="baths">Baths</option>
          </select>

          <select
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm"
          >
            {(sortLabels[form.by] ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {listings.data.length === 0 ? (
          <EmptyState icon={Building2} title="No listings yet" description="Create your first listing to get started." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {listings.data.map((listing) => (
              <div
                key={listing.id}
                className={`rounded-2xl border bg-card p-5 transition-colors ${listing.deleted_at ? "border-dashed border-border opacity-75" : "border-border"}`}
              >
                {listing.sold_at && (
                  <span className="mb-2 inline-block rounded-md border border-dashed border-green-500 px-1.5 py-0.5 text-xs font-bold uppercase text-green-600">Sold</span>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className={listing.deleted_at ? "opacity-40" : ""}>
                    <p className="text-2xl font-bold">{formatPrice(listing.price)}</p>
                    <div className="mt-1 flex gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {listing.beds}</span>
                      <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {listing.baths}</span>
                      <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {listing.area} m²</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{listing.street}, {listing.city}</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      <a href={route("listing.show", { listing: listing.id })} target="_blank" rel="noreferrer" className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">Preview</a>
                      <Link href={route("realtor.listing.edit", { listing: listing.id })} className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">Edit</Link>
                      {listing.deleted_at ? (
                        <Link href={route("realtor.listing.restore", { listing: listing.id })} method="put" as="button" className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">
                          <RotateCcw className="h-3 w-3" />
                        </Link>
                      ) : (
                        <Link href={route("realtor.listing.destroy", { listing: listing.id })} method="delete" as="button" className="rounded-md border border-destructive/40 px-2.5 py-1 text-xs text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                    <Link href={route("realtor.listing.image.create", { listing: listing.id })} className="block rounded-md border border-border px-2.5 py-1 text-center text-xs hover:bg-accent">
                      <Image className="mr-1 inline h-3 w-3" /> Images ({listing.images_count ?? 0})
                    </Link>
                    <Link href={route("realtor.listing.show", { listing: listing.id })} className="block rounded-md border border-border px-2.5 py-1 text-center text-xs hover:bg-accent">
                      Offers ({listing.offers_count ?? 0})
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {listings.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-1">
            {listings.links.map((link, i) => (
              link.url ? (
                <Link key={i} href={link.url}
                  className={`rounded-md border px-3 py-1.5 text-sm ${link.active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <span key={i} className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-40" dangerouslySetInnerHTML={{ __html: link.label }} />
              )
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
