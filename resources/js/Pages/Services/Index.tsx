import { Head, Link, router } from "@inertiajs/react";
import { ArrowRight, BrainCircuit, Clock, FileText, Pencil, Plus, Rocket, Settings2, Trash2, Wallet } from "lucide-react";
import { EmptyState, PageHeader, SiteShell } from "@/components/site/SiteShell";
import { StatusMessage } from "@/components/site/StatusMessage";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

type Props = {
  services: Service[];
};

const coverIcon = { launch: Rocket, operations: Settings2, ai: BrainCircuit } as const;

export default function ServicesIndex({ services }: Props) {
  const destroy = (service: Service) => {
    if (!window.confirm(`Delete "${service.name}"?`)) return;

    router.delete(`/dashboard/services/${service.id}`);
  };

  return (
    <SiteShell>
      <Head title="Services" />
      <PageHeader
        eyebrow="Portfolio content"
        title="Services"
        description="Manage public service packages, detail pages, publishing, ordering, deliverables, bonuses, and guarantees."
      >
        <Button asChild>
          <Link href="/dashboard/services/create">
            <Plus className="mr-2 h-4 w-4" /> Add service
          </Link>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />

        {services.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={FileText}
              title="No services yet"
              description="Add your first service package and it can appear on the public services pages."
              action={
                <Button asChild>
                  <Link href="/dashboard/services/create">
                    <Plus className="mr-2 h-4 w-4" /> Add service
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {services.map((service) => {
              const Icon = coverIcon[service.cover];

              return (
                <article
                  key={service.id}
                  className="grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-card lg:grid-cols-[minmax(0,1fr)_14rem]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/60 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h2 className="font-display text-xl font-semibold">{service.name}</h2>
                      {service.badge && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">{service.badge}</span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${service.is_published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {service.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{service.benefit}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
                        <Wallet className="h-3.5 w-3.5" /> {service.investment}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
                        <Clock className="h-3.5 w-3.5" /> {service.timeline}
                      </span>
                      <span className="rounded-md border border-border px-2 py-1">
                        Samples: {service.sample_projects_count ?? 0}
                      </span>
                      <span className="rounded-md border border-border px-2 py-1">Order: {service.sort_order}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(service.deliverables ?? []).slice(0, 6).map((deliverable) => (
                        <span key={deliverable} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-start gap-2 lg:flex-col lg:items-stretch lg:justify-center">
                    {service.is_published && (
                      <Button asChild variant="outline">
                        <Link href={`/services/${service.slug}`}>
                          View <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost">
                      <Link href={`/dashboard/services/${service.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => destroy(service)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
