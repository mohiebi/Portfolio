import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Bath, Bed, Filter, Home, Maximize2, Plus, X } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { PaginationNav } from "@/components/site/PaginationNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { Listing, PageProps, PaginatedData } from "@/types";

interface Filters {
  priceFrom?: string;
  priceTo?: string;
  beds?: string;
  baths?: string;
  areaFrom?: string;
  areaTo?: string;
}

interface Props {
  listings: PaginatedData<Listing>;
  filters: Filters;
}

export default function ListingIndex({ listings, filters }: Props) {
  const { auth } = usePage<PageProps>().props;
  const [form, setForm] = useState<Filters>(filters);

  const navigate = (merged: Filters) => {
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== "" && v != null)
    );
    router.get(route("listing.index"), cleaned, { preserveState: true, preserveScroll: true, replace: true });
  };

  const debouncedNavigate = useDebouncedCallback(navigate, 300);

  const visit = (next: Filters) => {
    const merged = { ...form, ...next };
    setForm(merged);
    debouncedNavigate(merged);
  };

  const visitNow = (next: Filters) => {
    const merged = { ...form, ...next };
    setForm(merged);
    navigate(merged);
  };

  const clear = () => {
    setForm({});
    router.get(route("listing.index"), {}, { preserveState: true });
  };

  const hasFilters = Object.values(filters).some((v) => v);

  return (
    <SiteShell>
      <Head title="Real Estate Listings" />
      <PageHeader eyebrow="Project / Real Estate" title="Property Listings" description="Browse available properties. Filter by price, beds, baths, or area.">
        {auth.user && (
          <Link href={route("realtor.listing.create")}>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Listing</Button>
          </Link>
        )}
      </PageHeader>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium"><Filter className="h-4 w-4" /> Filters</div>
            {hasFilters && (
              <button onClick={clear} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label>Price from</Label>
                <Input type="number" placeholder="Min" value={form.priceFrom ?? ""} onChange={(e) => visit({ priceFrom: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>Price to</Label>
                <Input type="number" placeholder="Max" value={form.priceTo ?? ""} onChange={(e) => visit({ priceTo: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="beds">Beds</Label>
              <select
                id="beds"
                value={form.beds ?? ""}
                onChange={(e) => visitNow({ beds: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm text-foreground shadow-sm"
              >
                <option value="" className="bg-background text-foreground">Any</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n} className="bg-background text-foreground">{n}</option>)}
                <option value="6" className="bg-background text-foreground">6+</option>
              </select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="baths">Baths</Label>
              <select
                id="baths"
                value={form.baths ?? ""}
                onChange={(e) => visitNow({ baths: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm text-foreground shadow-sm"
              >
                <option value="" className="bg-background text-foreground">Any</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n} className="bg-background text-foreground">{n}</option>)}
                <option value="6" className="bg-background text-foreground">6+</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label>Area from (m²)</Label>
                <Input type="number" placeholder="Min" value={form.areaFrom ?? ""} onChange={(e) => visit({ areaFrom: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>Area to (m²)</Label>
                <Input type="number" placeholder="Max" value={form.areaTo ?? ""} onChange={(e) => visit({ areaTo: e.target.value })} />
              </div>
            </div>
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">{listings.total} {listings.total === 1 ? "property" : "properties"} found</p>

          {listings.data.length === 0 ? (
            <EmptyState icon={Home} title="No properties found" description="Try widening your filters." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {listings.data.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
            </div>
          )}

          <PaginationNav links={listings.links} />
        </div>
      </section>
    </SiteShell>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={route("listing.show", { listing: listing.id })}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      {listing.images && listing.images.length > 0 ? (
        <img src={listing.images[0].src} alt={`${listing.street}, ${listing.city}`} className="h-40 w-full rounded-lg object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-muted">
          <Home className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <div>
        <p className="text-xl font-bold">{formatPrice(listing.price)}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{listing.street}, {listing.city} {listing.code}</p>
      </div>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {listing.beds} beds</span>
        <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {listing.baths} baths</span>
        <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {listing.area} m²</span>
      </div>
    </Link>
  );
}
