import { Head, Link, useForm } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

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
        <Button asChild variant="outline" type="button">
          <a href="/google/auth" className="gap-2">
            <GoogleIcon />
            Continue with Google
          </a>
        </Button>
      </form>
    </AuthShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
