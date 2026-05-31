import { Head, Link, useForm } from "@inertiajs/react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Article } from "@/types";

type Props = {
  article?: Article;
};

type ArticleForm = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  published_at: string;
  reading_time: number;
  is_published: boolean;
  sort_order: number;
  cover_data: string | null;
  cover_filename: string | null;
};

export default function ArticleFormPage({ article }: Props) {
  const editing = Boolean(article);
  const [previewUrl, setPreviewUrl] = useState<string | null>(article?.cover_url ?? null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const form = useForm<ArticleForm>({
    slug: article?.slug ?? "",
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
    body: article?.body ?? "",
    category: article?.category ?? "",
    published_at: toDateInput(article?.published_at),
    reading_time: article?.reading_time ?? 5,
    is_published: article?.is_published ?? false,
    sort_order: article?.sort_order ?? 0,
    cover_data: null,
    cover_filename: null,
  });

  const title = editing ? "Edit article" : "New article";
  const generatedSlug = useMemo(() => slugify(form.data.title), [form.data.title]);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const payload = formPayload({
      ...form.data,
      slug: form.data.slug || generatedSlug,
    });

    if (article) {
      form.transform(() => ({ ...payload, _method: "put" }));
      form.post(`/dashboard/articles/${article.id}`, {
        forceFormData: true,
        onFinish: () => form.transform((data) => data),
      });

      return;
    }

    form.transform(() => payload);
    form.post("/dashboard/articles", {
      forceFormData: true,
      onFinish: () => form.transform((data) => data),
    });
  };

  return (
    <SiteShell>
      <Head title={title} />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/dashboard/articles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to articles
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border bg-surface/40 px-6 py-5 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Portfolio writing</p>
            <h1 className="mt-2 font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Draft articles, publish them to the homepage, and keep the full detail page readable.
            </p>
          </div>

          <form className="grid gap-6 p-6 sm:p-8" onSubmit={submit}>
            <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
              <div>
                <Label htmlFor="cover">Cover image</Label>
                <label
                  htmlFor="cover"
                  className="mt-2 grid aspect-video cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-background/50 text-center transition-colors hover:border-primary/60"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid gap-2 px-4 text-sm text-muted-foreground">
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary/10 text-primary">
                        <ImagePlus className="h-6 w-6" />
                      </span>
                      Upload cover
                    </span>
                  )}
                </label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  className="mt-3"
                  onChange={async (event) => {
                    const file = event.target.files?.[0] ?? null;
                    setCoverError(null);

                    if (!file) {
                      form.setData((data) => ({
                        ...data,
                        cover_data: null,
                        cover_filename: null,
                      }));
                      setPreviewUrl(article?.cover_url ?? null);

                      return;
                    }

                    try {
                      const preparedCover = await prepareCoverImage(file);
                      form.setData((data) => ({
                        ...data,
                        cover_data: preparedCover.dataUrl,
                        cover_filename: preparedCover.filename,
                      }));
                      setPreviewUrl(preparedCover.dataUrl);
                    } catch {
                      form.setData((data) => ({
                        ...data,
                        cover_data: null,
                        cover_filename: null,
                      }));
                      setPreviewUrl(article?.cover_url ?? null);
                      setCoverError("This cover could not be prepared. Try a JPG, PNG, or WebP image.");
                    }
                  }}
                />
                {coverError && <p className="mt-1 text-sm text-destructive">{coverError}</p>}
                {(form.errors as any).cover && <p className="mt-1 text-sm text-destructive">{(form.errors as any).cover}</p>}
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-border bg-background/30 p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Article thumbnail</p>
                <h2 className="mt-2 font-display text-xl font-semibold">Used as the cover on cards and the article page.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  A wide image works best. The form will resize large uploads before sending them.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field error={form.errors.title} label="Title" required>
                <Input id="title" value={form.data.title} onChange={(event) => form.setData("title", event.target.value)} required />
              </Field>
              <Field error={form.errors.slug} label="Slug" required>
                <Input
                  id="slug"
                  value={form.data.slug}
                  onChange={(event) => form.setData("slug", event.target.value)}
                  placeholder={generatedSlug || "article-slug"}
                  required={!form.data.title}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_14rem_10rem_10rem]">
              <Field error={form.errors.category} label="Category">
                <Input id="category" value={form.data.category} onChange={(event) => form.setData("category", event.target.value)} placeholder="Laravel" />
              </Field>
              <Field error={form.errors.published_at} label="Published at">
                <Input
                  id="published_at"
                  type="date"
                  value={form.data.published_at}
                  onChange={(event) => form.setData("published_at", event.target.value)}
                  className="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter"
                />
              </Field>
              <Field error={form.errors.reading_time} label="Minutes">
                <Input
                  id="reading_time"
                  type="number"
                  min={1}
                  max={120}
                  value={form.data.reading_time}
                  onChange={(event) => form.setData("reading_time", Number(event.target.value))}
                />
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

            <Field error={form.errors.excerpt} label="Excerpt" required>
              <Textarea id="excerpt" rows={4} value={form.data.excerpt} onChange={(event) => form.setData("excerpt", event.target.value)} required />
            </Field>

            <Field error={form.errors.body} label="Body" required>
              <Textarea
                id="body"
                rows={16}
                value={form.data.body}
                onChange={(event) => form.setData("body", event.target.value)}
                placeholder="Use blank lines between paragraphs."
                required
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <label className="flex h-10 items-center gap-3 rounded-md border border-border bg-background px-3 text-sm">
                Published
                <Switch checked={form.data.is_published} onCheckedChange={(checked) => form.setData("is_published", checked)} aria-label="Published" />
              </label>
              <div className="flex gap-2">
                <Button asChild variant="ghost">
                  <Link href="/dashboard/articles">Cancel</Link>
                </Button>
                <Button type="submit" disabled={form.processing}>
                  <Save className="mr-2 h-4 w-4" /> {editing ? "Save changes" : "Add article"}
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function formPayload(data: ArticleForm): Record<string, string | number | boolean | null> {
  const payload: Record<string, string | number | boolean | null> = {
    slug: slugify(data.slug),
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    category: data.category,
    published_at: data.published_at || null,
    reading_time: data.reading_time,
    is_published: data.is_published ? "1" : "0",
    sort_order: data.sort_order,
  };

  if (data.cover_data) {
    payload.cover_data = data.cover_data;
    payload.cover_filename = data.cover_filename ?? "article-cover.jpg";
  }

  return payload;
}

async function prepareCoverImage(file: File): Promise<{ dataUrl: string; filename: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid image type.");
  }

  const image = await loadImage(file);
  const maxSize = 1600;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is unavailable.");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.86);
  });

  if (!blob) {
    throw new Error("Image conversion failed.");
  }

  const filename = `${file.name.replace(/\.[^.]+$/, "") || "article-cover"}.jpg`;

  return {
    dataUrl: await blobToDataUrl(blob),
    filename,
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed."));
    };
    image.src = url;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Image read failed."));
    reader.readAsDataURL(blob);
  });
}
