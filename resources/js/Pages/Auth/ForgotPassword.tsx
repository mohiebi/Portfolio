import { Head, Link, useForm } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/site/StatusMessage";

export default function ForgotPassword() {
  const form = useForm({ email: "" });

  return (
    <AuthShell title="Reset password" subtitle="Enter your email and we will send a reset link." footer={<Link href="/login" className="text-primary hover:underline">Back to login</Link>}>
      <Head title="Forgot password" />
      <StatusMessage />
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); form.post("/forgot-password"); }}>
        <div className="grid gap-1.5"><Label>Email</Label><Input type="email" value={form.data.email} onChange={(event) => form.setData("email", event.target.value)} required />{form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}</div>
        <Button disabled={form.processing}>Email reset link</Button>
      </form>
    </AuthShell>
  );
}
