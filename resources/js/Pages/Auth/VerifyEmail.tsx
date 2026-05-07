import { Head, Link, useForm } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/site/StatusMessage";

export default function VerifyEmail() {
  const form = useForm({});
  const logout = useForm({});

  return (
    <AuthShell title="Verify your email" subtitle="Check your inbox for the verification link.">
      <Head title="Verify email" />
      <StatusMessage />
      <div className="mt-4 flex flex-col gap-3">
        <Button disabled={form.processing} onClick={() => form.post("/email/verification-notification")}>Resend verification email</Button>
        <Button variant="ghost" disabled={logout.processing} onClick={() => logout.post("/logout")}>Log out</Button>
        <Link href="/" className="text-center text-sm text-muted-foreground hover:text-primary">Back to portfolio</Link>
      </div>
    </AuthShell>
  );
}
