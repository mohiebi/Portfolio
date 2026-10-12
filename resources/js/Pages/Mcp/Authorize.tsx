import { Head, usePage } from "@inertiajs/react";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import type { PageProps } from "@/types";
import { Check, ShieldCheck } from "lucide-react";

type AuthorizeProps = {
  client: { id: string; name: string };
  authToken: string;
  csrfToken: string;
};

export default function AuthorizePage() {
  const { auth, client, authToken, csrfToken } = usePage<PageProps<AuthorizeProps>>().props;
  const user = auth.user!;

  // Plain HTML forms on purpose: approving redirects the browser back to the AI client's
  // own callback URL, which an Inertia (XHR) request could not follow across origins.
  const hiddenFields = (
    <>
      <input type="hidden" name="_token" value={csrfToken} />
      <input type="hidden" name="state" value="" />
      <input type="hidden" name="client_id" value={client.id} />
      <input type="hidden" name="auth_token" value={authToken} />
    </>
  );

  return (
    <AuthShell title={`Connect ${client.name}`} subtitle="This app wants to use your task manager on your behalf.">
      <Head title="Connect your AI assistant" />
      <div className="grid gap-5">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="truncate text-sm font-semibold">{user.email}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">{client.name} will be able to:</p>
          <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              View, create, update and delete your tasks and subtasks
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            It cannot see your password or other account details. You can disconnect it at any time from your profile.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <form method="POST" action="/oauth/authorize">
            <input type="hidden" name="_method" value="DELETE" />
            {hiddenFields}
            <Button type="submit" variant="outline" className="w-full">
              Cancel
            </Button>
          </form>
          <form method="POST" action="/oauth/authorize">
            {hiddenFields}
            <Button type="submit" className="w-full">
              Authorize
            </Button>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
