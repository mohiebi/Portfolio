import { Head, useForm } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ConfirmPassword() {
  const form = useForm({ password: "" });

  return (
    <AuthShell title="Confirm password" subtitle="This secure area needs your password.">
      <Head title="Confirm password" />
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); form.post("/confirm-password"); }}>
        <div className="grid gap-1.5"><Label>Password</Label><Input type="password" value={form.data.password} onChange={(event) => form.setData("password", event.target.value)} required />{form.errors.password && <p className="text-sm text-destructive">{form.errors.password}</p>}</div>
        <Button disabled={form.processing}>Confirm</Button>
      </form>
    </AuthShell>
  );
}
