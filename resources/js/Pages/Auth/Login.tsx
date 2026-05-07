import { Head, Link, useForm } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/site/StatusMessage";

export default function LoginPage() {
  const form = useForm({
    email: "",
    password: "",
    remember: false,
  });

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your account, tasks, and applications." footer={<>Don't have an account? <Link href="/register" className="text-primary hover:underline">Sign up</Link></>}>
      <Head title="Log in" />
      <StatusMessage />
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); form.post("/login"); }}>
        <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.data.email} onChange={(event) => form.setData("email", event.target.value)} required />{form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}</div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">Forgot?</Link></div>
          <Input id="password" type="password" value={form.data.password} onChange={(event) => form.setData("password", event.target.value)} required />{form.errors.password && <p className="text-sm text-destructive">{form.errors.password}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={form.data.remember} onChange={(event) => form.setData("remember", event.target.checked)} className="h-4 w-4 rounded border-border" /> Remember me</label>
        <Button disabled={form.processing}>Log in</Button>
        <Button asChild variant="outline" type="button"><a href="/google/auth">Continue with Google</a></Button>
      </form>
    </AuthShell>
  );
}
