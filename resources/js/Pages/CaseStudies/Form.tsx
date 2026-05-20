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
import type { CaseStudy, CaseStudyImpact } from "@/types";

type Props = {
  caseStudy?: CaseStudy;
};

type CaseStudyForm = {
  slug: string;
  title: string;
  company: string;
  role: string;
  period: string;
  location: string;
  tag: string;
  summary: string;
  accent: string;
  cover: CaseStudy["cover"];
  problem: string;
  approach_text: string;
  impact_text: string;
  stack_text: string;
  highlights_text: string;
  is_published: boolean;
  sort_order: number;
};

const accentOptions = [
  "from-amber-400/30 to-orange-500/10",
  "from-sky-400/30 to-indigo-500/10",
  "from-emerald-400/30 to-teal-500/10",
  "from-rose-400/30 to-fuchsia-500/10",
];

export default function CaseStudyFormPage({ caseStudy }: Props) {
  const editing = Boolean(caseStudy);
  const form = useForm<CaseStudyForm>({
    slug: caseStudy?.slug ?? "",
    title: caseStudy?.title ?? "",
    company: caseStudy?.company ?? "",
    role: caseStudy?.role ?? "",
    period: caseStudy?.period ?? "",
    location: caseStudy?.location ?? "",
    tag: caseStudy?.tag ?? "",
    summary: caseStudy?.summary ?? "",
    accent: caseStudy?.accent ?? accentOptions[0],
    cover: caseStudy?.cover ?? "web",
    problem: caseStudy?.problem ?? "",
    approach_text: listToText(caseStudy?.approach),
    impact_text: impactToText(caseStudy?.impact),
    stack_text: listToText(caseStudy?.stack),
    highlights_text: listToText(caseStudy?.highlights),
    is_published: caseStudy?.is_published ?? true,
    sort_order: caseStudy?.sort_order ?? 0,
  });

  const title = editing ? "Edit case study" : "New case study";
  const generatedSlug = useMemo(() => slugify(form.data.title), [form.data.title]);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const payload = formPayload({
      ...form.data,
      slug: form.data.slug || generatedSlug,
    });

    if (caseStudy) {
      form.transform(() => ({ ...payload, _method: "put" }));
      form.post(`/dashboard/case-studies/${caseStudy.id}`, {
        onFinish: () => form.transform((data) => data),
      });

      return;
    }

    form.transform(() => payload);
    form.post("/dashboard/case-studies", {
      onFinish: () => form.transform((data) => data),
    });
  };

  return (
    <SiteShell>
      <Head title={title} />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/dashboard/case-studies" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to case studies
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border bg-surface/40 px-6 py-5 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Portfolio narrative</p>
            <h1 className="mt-2 font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Write the public overview, then break the detail page into problem, approach, impact, stack, and highlights.
            </p>
          </div>

          <form className="grid gap-6 p-6 sm:p-8" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field error={form.errors.title} label="Title" required>
                <Input id="title" value={form.data.title} onChange={(event) => form.setData("title", event.target.value)} required />
              </Field>
              <Field error={form.errors.slug} label="Slug" required>
                <Input
                  id="slug"
                  value={form.data.slug}
                  onChange={(event) => form.setData("slug", event.target.value)}
                  placeholder={generatedSlug || "case-study-slug"}
                  required={!form.data.title}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field error={form.errors.company} label="Company">
                <Input id="company" value={form.data.company} onChange={(event) => form.setData("company", event.target.value)} />
              </Field>
              <Field error={form.errors.role} label="Role">
                <Input id="role" value={form.data.role} onChange={(event) => form.setData("role", event.target.value)} />
              </Field>
              <Field error={form.errors.period} label="Period">
                <Input id="period" value={form.data.period} onChange={(event) => form.setData("period", event.target.value)} />
              </Field>
              <Field error={form.errors.location} label="Location">
                <Input id="location" value={form.data.location} onChange={(event) => form.setData("location", event.target.value)} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_10rem_10rem]">
              <Field error={form.errors.tag} label="Tag">
                <Input id="tag" value={form.data.tag} onChange={(event) => form.setData("tag", event.target.value)} placeholder="Laravel / AI / CRM" />
              </Field>
              <Field error={form.errors.accent} label="Accent">
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
              <Field error={form.errors.cover} label="Cover">
                <Select value={form.data.cover} onValueChange={(value) => form.setData("cover", value as CaseStudy["cover"])}>
                  <SelectTrigger id="cover">
                    <SelectValue placeholder="Cover" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web3">Web3</SelectItem>
                    <SelectItem value="modernize">Modernize</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
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

            <Field error={form.errors.summary} label="Summary" required>
              <Textarea id="summary" rows={4} value={form.data.summary} onChange={(event) => form.setData("summary", event.target.value)} required />
            </Field>

            <Field error={form.errors.problem} label="Problem">
              <Textarea id="problem" rows={5} value={form.data.problem} onChange={(event) => form.setData("problem", event.target.value)} />
            </Field>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field error={(form.errors as any).approach} label="Approach">
                <Textarea
                  id="approach"
                  rows={7}
                  value={form.data.approach_text}
                  onChange={(event) => form.setData("approach_text", event.target.value)}
                  placeholder="One approach item per line"
                />
              </Field>
              <Field error={(form.errors as any).highlights} label="Highlights">
                <Textarea
                  id="highlights"
                  rows={7}
                  value={form.data.highlights_text}
                  onChange={(event) => form.setData("highlights_text", event.target.value)}
                  placeholder="One highlight per line"
                />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field error={(form.errors as any).impact} label="Impact metrics">
                <Textarea
                  id="impact"
                  rows={6}
                  value={form.data.impact_text}
                  onChange={(event) => form.setData("impact_text", event.target.value)}
                  placeholder="Value | Label, one metric per line"
                />
              </Field>
              <Field error={(form.errors as any).stack} label="Stack">
                <Textarea
                  id="stack"
                  rows={6}
                  value={form.data.stack_text}
                  onChange={(event) => form.setData("stack_text", event.target.value)}
                  placeholder="One technology per line"
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <label className="flex h-10 items-center gap-3 rounded-md border border-border bg-background px-3 text-sm">
                Published
                <Switch checked={form.data.is_published} onCheckedChange={(checked) => form.setData("is_published", checked)} aria-label="Published" />
              </label>
              <div className="flex gap-2">
                <Button asChild variant="ghost">
                  <Link href="/dashboard/case-studies">Cancel</Link>
                </Button>
                <Button type="submit" disabled={form.processing}>
                  <Save className="mr-2 h-4 w-4" /> {editing ? "Save changes" : "Add case study"}
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

function impactToText(value?: CaseStudyImpact[] | null) {
  return (value ?? []).map((metric) => `${metric.value} | ${metric.label}`).join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function textToImpact(value: string): CaseStudyImpact[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valuePart, ...labelParts] = line.split("|");

      return {
        value: valuePart.trim(),
        label: (labelParts.join("|").trim() || valuePart.trim()),
      };
    });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formPayload(data: CaseStudyForm) {
  return {
    slug: slugify(data.slug),
    title: data.title,
    company: data.company,
    role: data.role,
    period: data.period,
    location: data.location,
    tag: data.tag,
    summary: data.summary,
    accent: data.accent,
    cover: data.cover,
    problem: data.problem,
    approach: textToList(data.approach_text),
    impact: textToImpact(data.impact_text),
    stack: textToList(data.stack_text),
    highlights: textToList(data.highlights_text),
    is_published: data.is_published ? "1" : "0",
    sort_order: data.sort_order,
  };
}
