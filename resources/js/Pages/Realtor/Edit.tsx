import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { ListingForm } from "./ListingForm";
import type { Listing } from "@/types";

interface Props {
  listing: Listing;
}

export default function RealtorEdit({ listing }: Props) {
  const form = useForm({
    beds: listing.beds, baths: listing.baths, area: listing.area,
    city: listing.city, street: listing.street, code: listing.code, price: listing.price,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.put(route("realtor.listing.update", { listing: listing.id }));
  };

  return (
    <SiteShell>
      <Head title="Edit Real Estate Listing" />
      <PageHeader eyebrow="Realtor Dashboard" title="Edit Listing" />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <ListingForm form={form} onSubmit={submit} submitLabel="Save Changes" />
        </div>
      </section>
    </SiteShell>
  );
}
