import { Head, Link, useForm } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  token: string;
  email: string;
};

export default function ResetPassword({ token, email }: Props) {
  const form = useForm({
    token,
    email,
    password: "",
    password_confirmation: "",
  });

  return (
    <AuthShell title="Choose a new password" footer={<Link href="/login" className="text-primary hover:underline">Back to login</Link>}>
      <Head title="Reset password" />
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); form.post("/reset-password"); }}>
        <Field label="Email" error={form.errors.email}><Input type="email" value={form.data.email} onChange={(event) => form.setData("email", event.target.value)} required /></Field>
        <Field label="Password" error={form.errors.password}><Input type="password" value={form.data.password} onChange={(event) => form.setData("password", event.target.value)} required /></Field>
        <Field label="Confirm password" error={form.errors.password_confirmation}><Input type="password" value={form.data.password_confirmation} onChange={(event) => form.setData("password_confirmation", event.target.value)} required /></Field>
        <Button disabled={form.processing}>Reset password</Button>
      </form>
    </AuthShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
