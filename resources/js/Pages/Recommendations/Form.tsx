import { Head, Link, useForm } from "@inertiajs/react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Linkedin, Save } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Recommendation } from "@/types";

type Props = {
  recommendation?: Recommendation;
};

type RecommendationForm = {
  name: string;
  role: string;
  company: string;
  relationship: string;
  project: string;
  linkedin_url: string;
  body: string;
  recommended_at: string;
  is_published: boolean;
  sort_order: number;
  image_data: string | null;
  image_filename: string | null;
};

export default function RecommendationFormPage({ recommendation }: Props) {
  const editing = Boolean(recommendation);
  const [previewUrl, setPreviewUrl] = useState<string | null>(recommendation?.image_url ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const form = useForm<RecommendationForm>({
    name: recommendation?.name ?? "",
    role: recommendation?.role ?? "",
    company: recommendation?.company ?? "",
    relationship: recommendation?.relationship ?? "",
    project: recommendation?.project ?? "",
    linkedin_url: recommendation?.linkedin_url ?? "",
    body: recommendation?.body ?? "",
    recommended_at: recommendation?.recommended_at ?? "",
    is_published: recommendation?.is_published ?? true,
    sort_order: recommendation?.sort_order ?? 0,
    image_data: null,
    image_filename: null,
  });

  const title = editing ? "Edit recommendation" : "New recommendation";
  const imageInitials = useMemo(() => getInitials(form.data.name), [form.data.name]);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const payload = formPayload(form.data);

    if (recommendation) {
      form.transform(() => ({ ...payload, _method: "put" }));
      form.post(`/recommendations/${recommendation.id}`, {
        forceFormData: true,
        onFinish: () => form.transform((data) => data),
      });

      return;
    }

    form.transform(() => payload);
    form.post("/recommendations", {
      forceFormData: true,
      onFinish: () => form.transform((data) => data),
    });
  };

  return (
    <SiteShell>
      <Head title={title} />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/recommendations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to recommendations
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border bg-surface/40 px-6 py-5 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">LinkedIn proof</p>
            <h1 className="mt-2 font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the recommender details manually, then link back to their LinkedIn profile.
            </p>
          </div>

          <form className="grid gap-6 p-6 sm:p-8" onSubmit={submit}>
            <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div>
                <Label htmlFor="image">Profile image</Label>
                <label
                  htmlFor="image"
                  className="mt-2 grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-background/50 text-center transition-colors hover:border-primary/60"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid gap-2 px-4 text-sm text-muted-foreground">
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                        {imageInitials || <ImagePlus className="h-6 w-6" />}
                      </span>
                      Upload portrait
                    </span>
                  )}
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="mt-3"
                  onChange={async (event) => {
                    const file = event.target.files?.[0] ?? null;
                    setImageError(null);

                    if (!file) {
                      form.setData((data) => ({
                        ...data,
                        image_data: null,
                        image_filename: null,
                      }));
                      setPreviewUrl(recommendation?.image_url ?? null);

                      return;
                    }

                    try {
                      const preparedImage = await prepareProfileImage(file);
                      form.setData((data) => ({
                        ...data,
                        image_data: preparedImage.dataUrl,
                        image_filename: preparedImage.filename,
                      }));
                      setPreviewUrl(preparedImage.dataUrl);
                    } catch {
                      form.setData((data) => ({
                        ...data,
                        image_data: null,
                        image_filename: null,
                      }));
                      setPreviewUrl(recommendation?.image_url ?? null);
                      setImageError("This image could not be prepared. Try a JPG, PNG, or WebP image.");
                    }
                  }}
                />
                {imageError && <p className="mt-1 text-sm text-destructive">{imageError}</p>}
                {form.errors.image && <p className="mt-1 text-sm text-destructive">{form.errors.image}</p>}
              </div>

              <div className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field error={form.errors.name} label="Name" required>
                    <Input
                      id="name"
                      value={form.data.name}
                      onChange={(event) => form.setData("name", event.target.value)}
                      placeholder="Recommender name"
                      required
                    />
                  </Field>
                  <Field error={form.errors.role} label="Role / title">
                    <Input
                      id="role"
                      value={form.data.role}
                      onChange={(event) => form.setData("role", event.target.value)}
                      placeholder="Role or title"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field error={form.errors.company} label="Company">
                    <Input
                      id="company"
                      value={form.data.company}
                      onChange={(event) => form.setData("company", event.target.value)}
                      placeholder="Company name"
                    />
                  </Field>
                  <Field error={form.errors.project} label="Same project">
                    <Input
                      id="project"
                      value={form.data.project}
                      onChange={(event) => form.setData("project", event.target.value)}
                      placeholder="Project name"
                    />
                  </Field>
                </div>

                <Field error={form.errors.relationship} label="Relationship">
                  <Input
                    id="relationship"
                    value={form.data.relationship}
                    onChange={(event) => form.setData("relationship", event.target.value)}
                    placeholder="How you worked together"
                  />
                </Field>

                <Field error={form.errors.linkedin_url} label="LinkedIn profile URL">
                  <div className="relative">
                    <Linkedin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="linkedin_url"
                      className="pl-9"
                      value={form.data.linkedin_url}
                      onChange={(event) => form.setData("linkedin_url", event.target.value)}
                      placeholder="https://www.linkedin.com/in/..."
                    />
                  </div>
                </Field>
              </div>
            </div>

            <Field error={form.errors.body} label="Recommendation" required>
              <Textarea
                id="body"
                rows={8}
                value={form.data.body}
                onChange={(event) => form.setData("body", event.target.value)}
                placeholder="Paste the LinkedIn recommendation text here..."
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-[1fr_10rem_10rem]">
              <Field error={form.errors.recommended_at} label="Received date">
                <Input
                  id="recommended_at"
                  type="date"
                  value={form.data.recommended_at}
                  onChange={(event) => form.setData("recommended_at", event.target.value)}
                  className="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter"
                />
              </Field>
              <Field error={form.errors.sort_order} label="Sort order">
                <Input
                  id="sort_order"
                  type="number"
                  min={0}
                  value={form.data.sort_order}
                  onChange={(event) => form.setData("sort_order", Number(event.target.value))}
                />
              </Field>
              <div className="flex items-end">
                <label className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-sm">
                  Published
                  <Switch
                    checked={form.data.is_published}
                    onCheckedChange={(checked) => form.setData("is_published", checked)}
                    aria-label="Published"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-6">
              <Button asChild variant="ghost">
                <Link href="/recommendations">Cancel</Link>
              </Button>
              <Button type="submit" disabled={form.processing}>
                <Save className="mr-2 h-4 w-4" /> {editing ? "Save changes" : "Add recommendation"}
              </Button>
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
  const id = label.toLowerCase().replaceAll(" ", "_");

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formPayload(data: RecommendationForm): Record<string, string | number | boolean> {
  const payload: Record<string, string | number | boolean> = {
    name: data.name,
    role: data.role,
    company: data.company,
    relationship: data.relationship,
    project: data.project,
    linkedin_url: data.linkedin_url,
    body: data.body,
    recommended_at: data.recommended_at,
    is_published: data.is_published ? "1" : "0",
    sort_order: data.sort_order,
  };

  if (data.image_data) {
    payload.image_data = data.image_data;
    payload.image_filename = data.image_filename ?? "profile-image.jpg";
  }

  return payload;
}

async function prepareProfileImage(file: File): Promise<{ dataUrl: string; filename: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid image type.");
  }

  const image = await loadImage(file);
  const maxSize = 1200;
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

  const filename = `${file.name.replace(/\.[^.]+$/, "") || "profile-image"}.jpg`;

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
