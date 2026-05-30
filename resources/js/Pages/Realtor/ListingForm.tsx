import { InertiaFormProps } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ListingFormData {
  beds: number;
  baths: number;
  area: number;
  city: string;
  street: string;
  code: string;
  price: number;
}

interface Props {
  form: InertiaFormProps<ListingFormData>;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

export function ListingForm({ form, onSubmit, submitLabel }: Props) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-6 gap-4">
      <Field label="Beds" col="col-span-2" error={form.errors.beds}>
        <Input type="number" value={form.data.beds} onChange={(e) => form.setData("beds", parseInt(e.target.value) || 0)} />
      </Field>
      <Field label="Baths" col="col-span-2" error={form.errors.baths}>
        <Input type="number" value={form.data.baths} onChange={(e) => form.setData("baths", parseInt(e.target.value) || 0)} />
      </Field>
      <Field label="Area (m²)" col="col-span-2" error={form.errors.area}>
        <Input type="number" value={form.data.area} onChange={(e) => form.setData("area", parseInt(e.target.value) || 0)} />
      </Field>
      <Field label="City" col="col-span-4" error={form.errors.city}>
        <Input type="text" value={form.data.city} onChange={(e) => form.setData("city", e.target.value)} />
      </Field>
      <Field label="Post Code" col="col-span-2" error={form.errors.code}>
        <Input type="text" value={form.data.code} onChange={(e) => form.setData("code", e.target.value)} />
      </Field>
      <Field label="Street" col="col-span-6" error={form.errors.street}>
        <Input type="text" value={form.data.street} onChange={(e) => form.setData("street", e.target.value)} />
      </Field>
      <Field label="Price ($)" col="col-span-6" error={form.errors.price}>
        <Input type="number" value={form.data.price} onChange={(e) => form.setData("price", parseInt(e.target.value) || 0)} />
      </Field>
      <div className="col-span-6">
        <Button type="submit" disabled={form.processing}>{submitLabel}</Button>
      </div>
    </form>
  );
}

function Field({ label, col, error, children }: { label: string; col: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={col}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
