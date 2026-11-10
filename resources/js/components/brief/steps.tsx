import { useBrief } from "@/components/brief/BriefProvider";
import { Field, controlProps } from "@/components/brief/Field";
import { FileDrop } from "@/components/brief/FileDrop";
import { LikedSites } from "@/components/brief/LikedSites";
import { ChipGroup, ChoiceCards } from "@/components/brief/OptionGroups";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_EXTENSIONS,
  BRIEF_LIMITS,
  buildOptions,
  type BriefFormData,
} from "@/lib/brief";

export type StepProps = {
  data: BriefFormData;
  errors: Record<string, string | undefined>;
  set: <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => void;
};

/** First server error that belongs to a field, including nested keys such as `attachments.0`. */
function errorFor(errors: StepProps["errors"], field: string): string | undefined {
  if (errors[field]) return errors[field];

  const nested = Object.keys(errors).find((key) => key.startsWith(`${field}.`));

  return nested ? errors[nested] : undefined;
}

export function AboutStep({ data, errors, set }: StepProps) {
  const { copy } = useBrief();
  const f = copy.fields;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="brief-name" label={f.name.label} required error={errors.name}>
          <Input
            {...controlProps("brief-name", { error: errors.name })}
            autoComplete="name"
            placeholder={f.name.placeholder}
            value={data.name}
            onChange={(event) => set("name", event.target.value)}
          />
        </Field>
        <Field id="brief-email" label={f.email.label} required error={errors.email}>
          <Input
            {...controlProps("brief-email", { error: errors.email })}
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={f.email.placeholder}
            value={data.email}
            onChange={(event) => set("email", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="brief-company" label={f.company.label} hint={f.company.hint} error={errors.company}>
          <Input
            {...controlProps("brief-company", { hasHint: true, error: errors.company })}
            autoComplete="organization"
            placeholder={f.company.placeholder}
            value={data.company}
            onChange={(event) => set("company", event.target.value)}
          />
        </Field>
        <Field id="brief-website_url" label={f.website_url.label} hint={f.website_url.hint} error={errors.website_url}>
          <Input
            {...controlProps("brief-website_url", { hasHint: true, error: errors.website_url })}
            dir="ltr"
            inputMode="url"
            autoComplete="url"
            placeholder={f.website_url.placeholder}
            value={data.website_url}
            onChange={(event) => set("website_url", event.target.value)}
          />
        </Field>
      </div>

      <Field
        id="brief-business_description"
        label={f.business_description.label}
        required
        hint={f.business_description.hint}
        error={errors.business_description}
      >
        <Textarea
          {...controlProps("brief-business_description", { hasHint: true, error: errors.business_description })}
          rows={4}
          placeholder={f.business_description.placeholder}
          value={data.business_description}
          onChange={(event) => set("business_description", event.target.value)}
        />
      </Field>
    </div>
  );
}

export function ProjectStep({ data, errors, set }: StepProps) {
  const { copy } = useBrief();
  const f = copy.fields;

  return (
    <div className="grid gap-6">
      <Field
        id="brief-project_type"
        label={f.project_type.label}
        required
        group
        hint={f.project_type.hint}
        error={errors.project_type}
      >
        <ChoiceCards
          name="project_type"
          options={buildOptions("projectTypes", copy)}
          value={data.project_type}
          onChange={(value) => set("project_type", value)}
        />
      </Field>

      <Field
        id="brief-goals"
        label={f.goals.label}
        required
        group
        hint={f.goals.hint}
        error={errorFor(errors, "goals")}
      >
        <ChipGroup
          name="goals"
          options={buildOptions("goals", copy)}
          values={data.goals}
          max={BRIEF_LIMITS.goals}
          onChange={(values) => set("goals", values)}
        />
      </Field>

      <Field id="brief-audience" label={f.audience.label} required hint={f.audience.hint} error={errors.audience}>
        <Textarea
          {...controlProps("brief-audience", { hasHint: true, error: errors.audience })}
          rows={3}
          placeholder={f.audience.placeholder}
          value={data.audience}
          onChange={(event) => set("audience", event.target.value)}
        />
      </Field>

      <Field
        id="brief-primary_action"
        label={f.primary_action.label}
        hint={f.primary_action.hint}
        error={errors.primary_action}
      >
        <Input
          {...controlProps("brief-primary_action", { hasHint: true, error: errors.primary_action })}
          placeholder={f.primary_action.placeholder}
          value={data.primary_action}
          onChange={(event) => set("primary_action", event.target.value)}
        />
      </Field>

      <Field id="brief-competitors" label={f.competitors.label} hint={f.competitors.hint} error={errors.competitors}>
        <Textarea
          {...controlProps("brief-competitors", { hasHint: true, error: errors.competitors })}
          rows={3}
          placeholder={f.competitors.placeholder}
          value={data.competitors}
          onChange={(event) => set("competitors", event.target.value)}
        />
      </Field>
    </div>
  );
}

export function ScopeStep({ data, errors, set }: StepProps) {
  const { copy } = useBrief();
  const f = copy.fields;

  return (
    <div className="grid gap-6">
      <Field id="brief-pages" label={f.pages.label} group hint={f.pages.hint} error={errorFor(errors, "pages")}>
        <ChipGroup name="pages" options={buildOptions("pages", copy)} values={data.pages} onChange={(values) => set("pages", values)} />
      </Field>

      <Field id="brief-features" label={f.features.label} group hint={f.features.hint} error={errorFor(errors, "features")}>
        <ChipGroup
          name="features"
          options={buildOptions("features", copy)}
          values={data.features}
          onChange={(values) => set("features", values)}
        />
      </Field>

      <Field id="brief-extra_requirements" label={f.extra_requirements.label} error={errors.extra_requirements}>
        <Textarea
          {...controlProps("brief-extra_requirements", { error: errors.extra_requirements })}
          rows={3}
          placeholder={f.extra_requirements.placeholder}
          value={data.extra_requirements}
          onChange={(event) => set("extra_requirements", event.target.value)}
        />
      </Field>

      <Field id="brief-languages" label={f.languages.label} group hint={f.languages.hint} error={errorFor(errors, "languages")}>
        <ChipGroup
          name="languages"
          options={buildOptions("languages", copy)}
          values={data.languages}
          onChange={(values) => set("languages", values)}
        />
        {data.languages.includes("other") && (
          <Input
            {...controlProps("brief-other_language", { error: errors.other_language })}
            aria-label={f.other_language.label}
            className="mt-1 sm:max-w-sm"
            placeholder={f.other_language.placeholder}
            value={data.other_language}
            onChange={(event) => set("other_language", event.target.value)}
          />
        )}
      </Field>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          id="brief-content_readiness"
          label={f.content_readiness.label}
          group
          hint={f.content_readiness.hint}
          error={errors.content_readiness}
        >
          <ChoiceCards
            name="content_readiness"
            options={buildOptions("contentReadiness", copy)}
            value={data.content_readiness}
            onChange={(value) => set("content_readiness", value)}
            variant="pill"
          />
        </Field>
        <Field
          id="brief-domain_status"
          label={f.domain_status.label}
          group
          hint={f.domain_status.hint}
          error={errors.domain_status}
        >
          <ChoiceCards
            name="domain_status"
            options={buildOptions("domainStatus", copy)}
            value={data.domain_status}
            onChange={(value) => set("domain_status", value)}
            variant="pill"
          />
        </Field>
      </div>
    </div>
  );
}

export function DesignStep({ data, errors, set }: StepProps) {
  const { copy } = useBrief();
  const f = copy.fields;

  return (
    <div className="grid gap-6">
      <Field id="brief-brand_assets" label={f.brand_assets.label} group error={errorFor(errors, "brand_assets")}>
        <ChipGroup
          name="brand_assets"
          options={buildOptions("brandAssets", copy)}
          values={data.brand_assets}
          onChange={(values) => set("brand_assets", values)}
        />
      </Field>

      <Field
        id="brief-attachments"
        label={f.attachments.label}
        hint={f.attachments.hint}
        error={errorFor(errors, "attachments")}
      >
        <FileDrop
          id="brief-attachments"
          files={data.attachments}
          onChange={(files) => set("attachments", files)}
          max={BRIEF_LIMITS.attachments}
          maxMb={BRIEF_LIMITS.attachmentMb}
          accept={ATTACHMENT_ACCEPT}
          extensions={ATTACHMENT_EXTENSIONS}
          error={errorFor(errors, "attachments")}
          describedBy="brief-attachments-hint"
        />
      </Field>

      <Field
        id="brief-styles"
        label={f.styles.label}
        required
        group
        hint={f.styles.hint}
        error={errorFor(errors, "styles")}
      >
        <ChipGroup
          name="styles"
          options={buildOptions("styles", copy)}
          values={data.styles}
          max={BRIEF_LIMITS.styles}
          variant="card"
          onChange={(values) => set("styles", values)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="brief-brand_words" label={f.brand_words.label} error={errors.brand_words}>
          <Input
            {...controlProps("brief-brand_words", { error: errors.brand_words })}
            placeholder={f.brand_words.placeholder}
            value={data.brand_words}
            onChange={(event) => set("brand_words", event.target.value)}
          />
        </Field>
        <Field
          id="brief-colour_preferences"
          label={f.colour_preferences.label}
          hint={f.colour_preferences.hint}
          error={errors.colour_preferences}
        >
          <Input
            {...controlProps("brief-colour_preferences", { hasHint: true, error: errors.colour_preferences })}
            placeholder={f.colour_preferences.placeholder}
            value={data.colour_preferences}
            onChange={(event) => set("colour_preferences", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field id="brief-colour_mode" label={f.colour_mode.label} group error={errors.colour_mode}>
          <ChoiceCards
            name="colour_mode"
            options={buildOptions("colourModes", copy)}
            value={data.colour_mode}
            onChange={(value) => set("colour_mode", value)}
            variant="pill"
          />
        </Field>
        <Field id="brief-typography" label={f.typography.label} group error={errors.typography}>
          <ChoiceCards
            name="typography"
            options={buildOptions("typography", copy)}
            value={data.typography}
            onChange={(value) => set("typography", value)}
            variant="pill"
          />
        </Field>
      </div>

      <Field id="brief-liked_sites" label={f.liked_sites.label} group hint={f.liked_sites.hint} error={errors.liked_sites}>
        <LikedSites
          baseId="brief-liked"
          rows={data.liked_sites}
          max={BRIEF_LIMITS.likedSites}
          errors={errors}
          onChange={(rows) => set("liked_sites", rows)}
        />
      </Field>

      <Field id="brief-disliked_sites" label={f.disliked_sites.label} error={errors.disliked_sites}>
        <Textarea
          {...controlProps("brief-disliked_sites", { error: errors.disliked_sites })}
          rows={3}
          placeholder={f.disliked_sites.placeholder}
          value={data.disliked_sites}
          onChange={(event) => set("disliked_sites", event.target.value)}
        />
      </Field>
    </div>
  );
}

export function BudgetStep({ data, errors, set }: StepProps) {
  const { copy } = useBrief();
  const f = copy.fields;

  return (
    <div className="grid gap-6">
      <Field id="brief-budget" label={f.budget.label} required group hint={f.budget.hint} error={errors.budget}>
        <ChoiceCards
          name="budget"
          options={buildOptions("budgets", copy)}
          value={data.budget}
          onChange={(value) => set("budget", value)}
          variant="pill"
        />
      </Field>

      <Field id="brief-timeline" label={f.timeline.label} required group error={errors.timeline}>
        <ChoiceCards
          name="timeline"
          options={buildOptions("timelines", copy)}
          value={data.timeline}
          onChange={(value) => set("timeline", value)}
          variant="pill"
        />
      </Field>

      <Field id="brief-deadline_note" label={f.deadline_note.label} error={errors.deadline_note}>
        <Input
          {...controlProps("brief-deadline_note", { error: errors.deadline_note })}
          placeholder={f.deadline_note.placeholder}
          value={data.deadline_note}
          onChange={(event) => set("deadline_note", event.target.value)}
        />
      </Field>

      <Field id="brief-support" label={f.support.label} group error={errors.support}>
        <ChoiceCards
          name="support"
          options={buildOptions("support", copy)}
          value={data.support}
          onChange={(value) => set("support", value)}
          variant="pill"
        />
      </Field>

      <Field id="brief-preferred_contact" label={f.preferred_contact.label} required group error={errors.preferred_contact}>
        <ChoiceCards
          name="preferred_contact"
          options={buildOptions("contactMethods", copy)}
          value={data.preferred_contact}
          onChange={(value) => set("preferred_contact", value)}
          variant="pill"
        />
      </Field>

      {data.preferred_contact === "phone" && (
        <Field id="brief-phone" label={f.phone.label} required error={errors.phone}>
          <Input
            {...controlProps("brief-phone", { error: errors.phone })}
            type="tel"
            dir="ltr"
            autoComplete="tel"
            className="sm:max-w-sm"
            placeholder={f.phone.placeholder}
            value={data.phone}
            onChange={(event) => set("phone", event.target.value)}
          />
        </Field>
      )}

      <Field id="brief-notes" label={f.notes.label} error={errors.notes}>
        <Textarea
          {...controlProps("brief-notes", { error: errors.notes })}
          rows={3}
          placeholder={f.notes.placeholder}
          value={data.notes}
          onChange={(event) => set("notes", event.target.value)}
        />
      </Field>

      <div className="grid gap-2" data-invalid={errors.consent ? "true" : undefined}>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4">
          <Checkbox
            id="brief-consent"
            checked={data.consent}
            onCheckedChange={(checked) => set("consent", checked === true)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "brief-consent-error" : undefined}
            className="mt-0.5"
          />
          <Label htmlFor="brief-consent" className="text-sm font-normal leading-relaxed">
            {f.consent.label}
            <span className="ms-1 text-primary" aria-hidden="true">
              *
            </span>
            <span className="sr-only">{copy.common.required}</span>
          </Label>
        </div>
        {errors.consent && (
          <p id="brief-consent-error" role="alert" className="text-sm text-destructive">
            {errors.consent}
          </p>
        )}
      </div>
    </div>
  );
}
