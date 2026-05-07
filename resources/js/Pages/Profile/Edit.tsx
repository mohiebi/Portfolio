import { Head, useForm, usePage } from "@inertiajs/react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/site/StatusMessage";
import type { PageProps } from "@/types";

export default function ProfilePage() {
  const user = usePage<PageProps>().props.auth.user!;
  const profile = useForm({ name: user.name, email: user.email });
  const password = useForm({ current_password: "", password: "", password_confirmation: "" });
  const destroy = useForm({ password: "" });

  return (
    <SiteShell>
      <Head title="Profile" />
      <PageHeader eyebrow="Account" title="Profile" description="Manage your personal info, password and account." />
      <section className="mx-auto grid max-w-3xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />
        <Card title="Profile information" description="Update your account's profile information and email address.">
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); profile.patch("/profile"); }}>
            <Field label="Name" error={profile.errors.name}><Input value={profile.data.name} onChange={(event) => profile.setData("name", event.target.value)} /></Field>
            <Field label="Email" error={profile.errors.email}><Input type="email" value={profile.data.email} onChange={(event) => profile.setData("email", event.target.value)} /></Field>
            <div className="flex justify-end"><Button disabled={profile.processing}>Save</Button></div>
          </form>
        </Card>
        <Card title="Update password" description="Use a long, random password to keep your account secure.">
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); password.put("/password", { onSuccess: () => password.reset() }); }}>
            <Field label="Current password" error={password.errors.current_password}><Input type="password" value={password.data.current_password} onChange={(event) => password.setData("current_password", event.target.value)} /></Field>
            <Field label="New password" error={password.errors.password}><Input type="password" value={password.data.password} onChange={(event) => password.setData("password", event.target.value)} /></Field>
            <Field label="Confirm" error={password.errors.password_confirmation}><Input type="password" value={password.data.password_confirmation} onChange={(event) => password.setData("password_confirmation", event.target.value)} /></Field>
            <div className="flex justify-end"><Button disabled={password.processing}>Update password</Button></div>
          </form>
        </Card>
        <Card title="Delete account" description="This action is permanent and cannot be undone." tone="danger">
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); destroy.delete("/profile"); }}>
            <Field label="Password" error={destroy.errors.password}><Input type="password" value={destroy.data.password} onChange={(event) => destroy.setData("password", event.target.value)} /></Field>
            <Button variant="ghost" className="justify-self-start text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={destroy.processing}>Delete my account</Button>
          </form>
        </Card>
      </section>
    </SiteShell>
  );
}

function Card({ title, description, children, tone }: { title: string; description?: string; children: React.ReactNode; tone?: "danger" }) {
  return <div className={`rounded-2xl border bg-card p-6 sm:p-8 ${tone === "danger" ? "border-destructive/40" : "border-border"}`}><h2 className="font-display text-lg font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}<div className="mt-5">{children}</div></div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
