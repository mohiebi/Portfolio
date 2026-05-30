import { Head, Link } from "@inertiajs/react";
import { Bath, Bed, Maximize2 } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import type { Listing, Offer } from "@/types";

interface Props {
  listing: Listing & { offers: Offer[] };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export default function RealtorShow({ listing }: Props) {
  const isSold = listing.sold_at != null;

  return (
    <SiteShell>
      <Head title="Listing Offers" />
      <PageHeader eyebrow="Realtor Dashboard" title="Listing Offers" />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href={route("realtor.listing.index")} className="text-sm text-muted-foreground hover:text-foreground">← Back to listings</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-4">
            {listing.offers.length === 0 ? (
              <EmptyState icon={Bed} title="No offers yet" description="When buyers make offers they will appear here." />
            ) : (
              listing.offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} listingPrice={listing.price} isSold={isSold} />
              ))
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Basic Info</p>
            <p className="text-2xl font-bold">{formatPrice(listing.price)}</p>
            <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {listing.beds}</span>
              <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {listing.baths}</span>
              <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {listing.area} m²</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{listing.street}, {listing.city} {listing.code}</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function OfferCard({ offer, listingPrice, isSold }: { offer: Offer; listingPrice: number; isSold: boolean }) {
  const difference = offer.amount - listingPrice;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Offer #{offer.id}</p>
            {offer.accepted_at && (
              <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-bold uppercase text-green-700 dark:bg-green-900/40 dark:text-green-400">Accepted</span>
            )}
          </div>
          <p className="mt-1 text-xl font-bold">{formatPrice(offer.amount)}</p>
          <p className={`text-sm ${difference >= 0 ? "text-destructive" : "text-muted-foreground"}`}>
            Difference: {formatPrice(difference)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">By {offer.bidder?.name ?? "Unknown"}</p>
          <p className="text-xs text-muted-foreground">{offer.created_at ? new Date(offer.created_at).toDateString() : ""}</p>
        </div>

        {!isSold && !offer.accepted_at && (
          <Link
            href={route("realtor.offer.accept", { offer: offer.id })}
            method="put" as="button"
            className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/20"
          >
            Accept
          </Link>
        )}
      </div>
    </div>
  );
}
