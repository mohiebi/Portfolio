import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Bath, Bed, Expand, Home, Maximize2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Listing, Offer, PageProps } from "@/types";

interface Props {
  listing: Listing;
  offerMade: Offer | null;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function useMonthlyPayment(principal: number, annualRate: number, years: number) {
  return useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return { monthly: principal / months, total: principal, interest: 0 };
    const monthly = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const total = monthly * months;
    return { monthly, total, interest: total - principal };
  }, [principal, annualRate, years]);
}

export default function ListingShow({ listing, offerMade }: Props) {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;

  const [interestRate, setInterestRate] = useState(2.5);
  const [duration, setDuration] = useState(25);
  const [offerAmount, setOfferAmount] = useState(listing.price);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const { monthly, total, interest } = useMonthlyPayment(offerAmount, interestRate, duration);
  const offerForm = useForm({ amount: listing.price });

  useEffect(() => {
    if (carouselApi && lightboxOpen) {
      carouselApi.scrollTo(lightboxIndex, true);
    }
  }, [carouselApi, lightboxOpen, lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const submitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    offerForm.post(route("listing.offer.store", { listing: listing.id }), { preserveScroll: true, preserveState: true });
  };

  return (
    <SiteShell>
      <Head title={`${listing.street}, ${listing.city}`} />
      <PageHeader eyebrow="Real Estate" title={`${listing.street}, ${listing.city} ${listing.code}`} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href={route("listing.index")} className="text-sm text-muted-foreground hover:text-foreground">← Back to listings</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            {listing.images && listing.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {listing.images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="group relative aspect-video overflow-hidden rounded-xl"
                  >
                    <img
                      src={img.src}
                      alt={`${listing.street}, ${listing.city} — photo ${index + 1} of ${listing.images?.length}`}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                      <Expand className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-muted">
                <div className="text-center text-muted-foreground"><Home className="mx-auto mb-2 h-10 w-10" /><p>No images uploaded</p></div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Basic Info</p>
              <p className="text-3xl font-bold">{formatPrice(listing.price)}</p>
              <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {listing.beds} beds</span>
                <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {listing.baths} baths</span>
                <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {listing.area} m²</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{listing.street}, {listing.city} {listing.code}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Monthly Payment</p>
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="interest-rate" className="text-sm text-foreground">Interest rate ({interestRate}%)</Label>
                  <input
                    id="interest-rate"
                    type="range" min={0.1} max={30} step={0.1} value={interestRate}
                    aria-valuetext={`${interestRate}%`}
                    onChange={(e) => { setInterestRate(parseFloat(e.target.value)); setOfferAmount(listing.price); }}
                    className="mt-1 w-full accent-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="loan-duration" className="text-sm text-foreground">Duration ({duration} years)</Label>
                  <input
                    id="loan-duration"
                    type="range" min={3} max={35} step={1} value={duration}
                    aria-valuetext={`${duration} years`}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="mt-1 w-full accent-primary"
                  />
                </div>
                <div className="mt-1 rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="text-muted-foreground text-xs">Monthly payment</p>
                  <p className="text-2xl font-bold">{formatPrice(monthly)}</p>
                  <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Total paid</span><span className="font-medium">{formatPrice(total)}</span></div>
                    <div className="flex justify-between"><span>Principal</span><span className="font-medium">{formatPrice(listing.price)}</span></div>
                    <div className="flex justify-between"><span>Interest</span><span className="font-medium">{formatPrice(interest)}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {user && !offerMade && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Make an Offer</p>
                <p className="mb-3 text-xs text-muted-foreground">Tip: offers within 5–10% of the asking price are most likely to be accepted.</p>
                <form onSubmit={submitOffer} className="grid gap-3">
                  <Input
                    type="number"
                    value={offerForm.data.amount}
                    onChange={(e) => { offerForm.setData("amount", parseInt(e.target.value) || 0); setOfferAmount(parseInt(e.target.value) || listing.price); }}
                  />
                  <input
                    type="range"
                    min={Math.round(listing.price / 2)} max={Math.round(listing.price * 2)} step={1000}
                    value={offerForm.data.amount}
                    onChange={(e) => { offerForm.setData("amount", parseInt(e.target.value)); setOfferAmount(parseInt(e.target.value)); }}
                    className="w-full accent-primary"
                  />
                  {offerForm.errors.amount && <p className="text-xs text-destructive">{offerForm.errors.amount}</p>}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Difference</span>
                    <span>{formatPrice(offerForm.data.amount - listing.price)}</span>
                  </div>
                  <Button type="submit" disabled={offerForm.processing}>Make an Offer</Button>
                </form>
              </div>
            )}

            {user && offerMade && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Offer Made</p>
                <p className="text-3xl font-bold">{formatPrice(offerMade.amount)}</p>
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>Made on</span>
                  <span className="font-medium">{offerMade.created_at ? new Date(offerMade.created_at).toDateString() : "—"}</span>
                </div>
              </div>
            )}

            {!user && (
              <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                <Link href={route("login")} className="text-primary hover:underline">Log in</Link> to make an offer.
              </div>
            )}
          </div>
        </div>
      </section>

      {listing.images && listing.images.length > 0 && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-3xl border-border bg-background p-2 sm:p-4">
            <DialogTitle className="sr-only">{listing.street}, {listing.city} photos</DialogTitle>
            <Carousel setApi={setCarouselApi} className="w-full">
              <CarouselContent>
                {listing.images.map((img, index) => (
                  <CarouselItem key={img.id}>
                    <img
                      src={img.src}
                      alt={`${listing.street}, ${listing.city} — photo ${index + 1} of ${listing.images?.length}`}
                      className="aspect-video w-full rounded-lg bg-black object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {listing.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          </DialogContent>
        </Dialog>
      )}
    </SiteShell>
  );
}
