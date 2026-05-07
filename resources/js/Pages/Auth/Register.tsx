import { Head, Link, useForm } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const form = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  return (
    <AuthShell title="Create your account" subtitle="It only takes a minute." footer={<>Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link></>}>
      <Head title="Create account" />
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); form.post("/register"); }}>
        <Field label="Name" error={form.errors.name}><Input value={form.data.name} onChange={(event) => form.setData("name", event.target.value)} required /></Field>
        <Field label="Email" error={form.errors.email}><Input type="email" value={form.data.email} onChange={(event) => form.setData("email", event.target.value)} required /></Field>
        <Field label="Password" error={form.errors.password}><Input type="password" value={form.data.password} onChange={(event) => form.setData("password", event.target.value)} required /></Field>
        <Field label="Confirm password" error={form.errors.password_confirmation}><Input type="password" value={form.data.password_confirmation} onChange={(event) => form.setData("password_confirmation", event.target.value)} required /></Field>
        <Button disabled={form.processing}>Create account</Button>
      </form>
    </AuthShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
