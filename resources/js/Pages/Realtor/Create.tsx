import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { ListingForm } from "./ListingForm";

export default function RealtorCreate() {
  const form = useForm({ beds: 0, baths: 0, area: 0, city: "", street: "", code: "", price: 0 });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(route("realtor.listing.store"));
  };

  return (
    <SiteShell>
      <Head title="Create Listing" />
      <PageHeader eyebrow="Realtor Dashboard" title="Create New Listing" />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <ListingForm form={form} onSubmit={submit} submitLabel="Create Listing" />
        </div>
      </section>
    </SiteShell>
  );
}
