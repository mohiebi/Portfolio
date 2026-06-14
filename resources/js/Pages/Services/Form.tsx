import { Head, Link, useForm } from "@inertiajs/react";
import { type FormEvent, type ReactNode, useMemo } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Service, ServiceBonus, ServiceGuarantee, ServiceProject } from "@/types";

type Props = {
  service?: Service;
};

type ServiceForm = {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  promise: string;
  investment: string;
  timeline: string;
  outcome: string;
  best_for: string;
  benefit: string;
  cover: Service["cover"];
  accent: string;
  problem: string;
  what_you_get: string;
  why_it_matters: string;
  before_text: string;
  after_text: string;
  deliverables_text: string;
  ai_capabilities_text: string;
  bonuses_text: string;
  guarantees_text: string;
  sample_projects_text: string;
  is_published: boolean;
  sort_order: number;
};

const accentOptions = [
  "from-emerald-400/25 to-sky-500/10",
  "from-emerald-400/30 to-teal-500/10",
  "from-emerald-400/30 to-indigo-500/10",
  "from-sky-400/30 to-indigo-500/10",
  "from-amber-400/30 to-orange-500/10",
];

export default function ServiceFormPage({ service }: Props) {
  const editing = Boolean(service);
  const form = useForm<ServiceForm>({
    slug: service?.slug ?? "",
    name: service?.name ?? "",
    badge: service?.badge ?? "",
    tagline: service?.tagline ?? "",
    promise: service?.promise ?? "",
    investment: service?.investment ?? "",
    timeline: service?.timeline ?? "",
    outcome: service?.outcome ?? "",
    best_for: service?.best_for ?? "",
    benefit: service?.benefit ?? "",
    cover: service?.cover ?? "launch",
    accent: service?.accent ?? accentOptions[0],
    problem: service?.problem ?? "",
    what_you_get: service?.what_you_get ?? "",
    why_it_matters: service?.why_it_matters ?? "",
    before_text: listToText(service?.before),
    after_text: listToText(service?.after),
    deliverables_text: listToText(service?.deliverables),
    ai_capabilities_text: listToText(service?.ai_capabilities),
    bonuses_text: bonusesToText(service?.bonuses),
    guarantees_text: guaranteesToText(service?.guarantees),
    sample_projects_text: sampleProjectsToText(service?.sample_projects),
    is_published: service?.is_published ?? true,
    sort_order: service?.sort_order ?? 0,
  });

  const title = editing ? "Edit service" : "New service";
  const generatedSlug = useMemo(() => slugify(form.data.name), [form.data.name]);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const payload = formPayload({
      ...form.data,
      slug: form.data.slug || generatedSlug,
    });

    if (service) {
      form.transform(() => ({ ...payload, _method: "put" }));
      form.post(`/dashboard/services/${service.id}`, {
        onFinish: () => form.transform((data) => data),
      });

      return;
    }

    form.transform(() => payload);
    form.post("/dashboard/services", {
      onFinish: () => form.transform((data) => data),
    });
  };

  return (
    <SiteShell>
      <Head title={title} />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/dashboard/services" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border bg-surface/40 px-6 py-5 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Portfolio services</p>
            <h1 className="mt-2 font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the public service package, detail page copy, deliverables, bonuses, and guarantees.
            </p>
          </div>

          <form className="grid gap-6 p-6 sm:p-8" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field error={form.errors.name} label="Name" required>
                <Input id="name" value={form.data.name} onChange={(event) => form.setData("name", event.target.value)} required />
              </Field>
              <Field error={form.errors.slug} label="Slug" required>
                <Input
                  id="slug"
                  value={form.data.slug}
                  onChange={(event) => form.setData("slug", event.target.value)}
                  placeholder={generatedSlug || "service-slug"}
                  required={!form.data.name}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_10rem]">
              <Field error={form.errors.tagline} label="Tagline" required>
                <Input id="tagline" value={form.data.tagline} onChange={(event) => form.setData("tagline", event.target.value)} required />
              </Field>
              <Field error={form.errors.badge} label="Badge">
                <Input id="badge" value={form.data.badge} onChange={(event) => form.setData("badge", event.target.value)} placeholder="Most popular" />
              </Field>
              <Field error={form.errors.cover} label="Cover" required>
                <Select value={form.data.cover} onValueChange={(value) => form.setData("cover", value as Service["cover"])}>
                  <SelectTrigger id="cover">
                    <SelectValue placeholder="Cover" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="launch">Launch</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field error={form.errors.sort_order} label="Order">
                <Input
                  id="sort_order"
                  type="number"
                  min={0}
                  value={form.data.sort_order}
                  onChange={(event) => form.setData("sort_order", Number(event.target.value))}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field error={form.errors.investment} label="Investment" required>
                <Input id="investment" value={form.data.investment} onChange={(event) => form.setData("investment", event.target.value)} required />
              </Field>
              <Field error={form.errors.timeline} label="Timeline" required>
                <Input id="timeline" value={form.data.timeline} onChange={(event) => form.setData("timeline", event.target.value)} required />
              </Field>
              <Field error={form.errors.outcome} label="Outcome" required>
                <Input id="outcome" value={form.data.outcome} onChange={(event) => form.setData("outcome", event.target.value)} required />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field error={form.errors.accent} label="Accent" required>
                <Select value={form.data.accent} onValueChange={(value) => form.setData("accent", value)}>
                  <SelectTrigger id="accent">
                    <SelectValue placeholder="Accent" />
                  </SelectTrigger>
                  <SelectContent>
                    {accentOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option.replaceAll("/", " / ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field error={form.errors.promise} label="Promise" required>
                <Input id="promise" value={form.data.promise} onChange={(event) => form.setData("promise", event.target.value)} required />
              </Field>
            </div>

            <Field error={form.errors.best_for} label="Best for" required>
              <Textarea id="best_for" rows={3} value={form.data.best_for} onChange={(event) => form.setData("best_for", event.target.value)} required />
            </Field>

            <Field error={form.errors.benefit} label="Benefit" required>
              <Textarea id="benefit" rows={4} value={form.data.benefit} onChange={(event) => form.setData("benefit", event.target.value)} required />
            </Field>

            <div className="grid gap-4 lg:grid-cols-3">
              <Field error={form.errors.problem} label="Problem" required>
                <Textarea id="problem" rows={7} value={form.data.problem} onChange={(event) => form.setData("problem", event.target.value)} required />
              </Field>
              <Field error={form.errors.what_you_get} label="What you get" required>
                <Textarea id="what_you_get" rows={7} value={form.data.what_you_get} onChange={(event) => form.setData("what_you_get", event.target.value)} required />
              </Field>
              <Field error={form.errors.why_it_matters} label="Why it matters" required>
                <Textarea id="why_it_matters" rows={7} value={form.data.why_it_matters} onChange={(event) => form.setData("why_it_matters", event.target.value)} required />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field error={(form.errors as any).before} label="Before">
                <Textarea id="before" rows={6} value={form.data.before_text} onChange={(event) => form.setData("before_text", event.target.value)} placeholder="One item per line" />
              </Field>
              <Field error={(form.errors as any).after} label="After">
                <Textarea id="after" rows={6} value={form.data.after_text} onChange={(event) => form.setData("after_text", event.target.value)} placeholder="One item per line" />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field error={(form.errors as any).deliverables} label="Deliverables">
                <Textarea id="deliverables" rows={8} value={form.data.deliverables_text} onChange={(event) => form.setData("deliverables_text", event.target.value)} placeholder="One deliverable per line" />
              </Field>
              <Field error={(form.errors as any).ai_capabilities} label="AI capabilities">
                <Textarea id="ai_capabilities" rows={8} value={form.data.ai_capabilities_text} onChange={(event) => form.setData("ai_capabilities_text", event.target.value)} placeholder="One capability per line" />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field error={(form.errors as any).bonuses} label="Bonuses">
                <Textarea
                  id="bonuses"
                  rows={8}
                  value={form.data.bonuses_text}
                  onChange={(event) => form.setData("bonuses_text", event.target.value)}
                  placeholder="Name | Value | Why, one bonus per line"
                />
              </Field>
              <Field error={(form.errors as any).guarantees} label="Guarantees">
                <Textarea
                  id="guarantees"
                  rows={8}
                  value={form.data.guarantees_text}
                  onChange={(event) => form.setData("guarantees_text", event.target.value)}
                  placeholder="Name | Detail, one guarantee per line"
                />
              </Field>
            </div>

            <Field error={(form.errors as any).sample_projects} label="Sample projects">
              <Textarea
                id="sample_projects"
                rows={6}
                value={form.data.sample_projects_text}
                onChange={(event) => form.setData("sample_projects_text", event.target.value)}
                placeholder="Name | URL | Tag | Summary | Outcome | Preview | Accent | Order, one project per line"
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <label className="flex h-10 items-center gap-3 rounded-md border border-border bg-background px-3 text-sm">
                Published
                <Switch checked={form.data.is_published} onCheckedChange={(checked) => form.setData("is_published", checked)} aria-label="Published" />
              </label>
              <div className="flex gap-2">
                <Button asChild variant="ghost">
                  <Link href="/dashboard/services">Cancel</Link>
                </Button>
                <Button type="submit" disabled={form.processing}>
                  <Save className="mr-2 h-4 w-4" /> {editing ? "Save changes" : "Add service"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  children,
  error,
  label,
  required = false,
}: {
  children: ReactNode;
  error?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function listToText(value?: string[] | null) {
  return (value ?? []).join("\n");
}

function bonusesToText(value?: ServiceBonus[] | null) {
  return (value ?? []).map((bonus) => `${bonus.name} | ${bonus.value} | ${bonus.why}`).join("\n");
}

function guaranteesToText(value?: ServiceGuarantee[] | null) {
  return (value ?? []).map((guarantee) => `${guarantee.name} | ${guarantee.detail}`).join("\n");
}

function sampleProjectsToText(value?: ServiceProject[] | null) {
  return (value ?? [])
    .map((project) =>
      [
        project.name,
        project.url,
        project.tag ?? "",
        project.summary,
        project.outcome ?? "",
        project.preview ?? "web",
        project.accent ?? "",
        project.sort_order ?? "",
      ].join(" | "),
    )
    .join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function textToBonuses(value: string): ServiceBonus[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, valuePart, ...whyParts] = line.split("|");

      return {
        name: name.trim(),
        value: (valuePart ?? "").trim(),
        why: whyParts.join("|").trim(),
      };
    })
    .filter((bonus) => bonus.name && bonus.value && bonus.why);
}

function textToGuarantees(value: string): ServiceGuarantee[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...detailParts] = line.split("|");

      return {
        name: name.trim(),
        detail: detailParts.join("|").trim(),
      };
    })
    .filter((guarantee) => guarantee.name && guarantee.detail);
}

function textToSampleProjects(value: string): ServiceProject[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [name, url, tag, summary, outcome, preview, accent, sortOrder] = line.split("|").map((part) => part.trim());

      return {
        name,
        url,
        tag: tag || null,
        summary,
        outcome: outcome || null,
        preview: (preview || "web") as ServiceProject["preview"],
        accent: accent || null,
        is_published: true,
        sort_order: sortOrder ? Number(sortOrder) : (index + 1) * 10,
      };
    })
    .filter((project) => project.name && project.url && project.summary);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formPayload(data: ServiceForm) {
  return {
    slug: slugify(data.slug),
    name: data.name,
    badge: data.badge || null,
    tagline: data.tagline,
    promise: data.promise,
    investment: data.investment,
    timeline: data.timeline,
    outcome: data.outcome,
    best_for: data.best_for,
    benefit: data.benefit,
    cover: data.cover,
    accent: data.accent,
    problem: data.problem,
    what_you_get: data.what_you_get,
    why_it_matters: data.why_it_matters,
    before: textToList(data.before_text),
    after: textToList(data.after_text),
    deliverables: textToList(data.deliverables_text),
    ai_capabilities: textToList(data.ai_capabilities_text),
    bonuses: textToBonuses(data.bonuses_text),
    guarantees: textToGuarantees(data.guarantees_text),
    sample_projects: textToSampleProjects(data.sample_projects_text),
    is_published: data.is_published ? "1" : "0",
    sort_order: data.sort_order,
  };
}
