import { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { Code2 } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen bg-grid">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-2 font-display text-base font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Code2 className="h-4 w-4" />
          </span>
          Mohi
        </Link>
        <div className="my-auto">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <p className="mt-5 text-center text-sm text-muted-foreground">{footer}</p>}
        </div>
      </div>
    </div>
  );
}
