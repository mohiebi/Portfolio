import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, controlProps } from "@/components/brief/Field";
import { FileDrop } from "@/components/brief/FileDrop";
import { LikedSites } from "@/components/brief/LikedSites";
import { ChipGroup, ChoiceCards } from "@/components/brief/OptionGroups";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_EXTENSIONS,
  BRIEF_LIMITS,
  brandAssets,
  budgets,
  colourModes,
  contactMethods,
  contentReadiness,
  domainStatus,
  features,
  goals,
  languages,
  pages,
  projectTypes,
  styles,
  supportOptions,
  timelines,
  typography,
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
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="brief-name" label="Your name" required error={errors.name}>
          <Input
            {...controlProps("brief-name", { error: errors.name })}
            autoComplete="name"
            placeholder="Anna Müller"
            value={data.name}
            onChange={(event) => set("name", event.target.value)}
          />
        </Field>
        <Field id="brief-email" label="Email" required error={errors.email}>
          <Input
            {...controlProps("brief-email", { error: errors.email })}
            type="email"
            autoComplete="email"
            placeholder="anna@studio-mueller.de"
            value={data.email}
            onChange={(event) => set("email", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="brief-company"
          label="Company or brand name"
          hint="Skip this if you are an individual."
          error={errors.company}
        >
          <Input
            {...controlProps("brief-company", { hasHint: true, error: errors.company })}
            autoComplete="organization"
            placeholder="Studio Müller Interiors"
            value={data.company}
            onChange={(event) => set("company", event.target.value)}
          />
        </Field>
        <Field
          id="brief-website_url"
          label="Current website"
          hint="Leave empty if you do not have one yet."
          error={errors.website_url}
        >
          <Input
            {...controlProps("brief-website_url", { hasHint: true, error: errors.website_url })}
            inputMode="url"
            autoComplete="url"
            placeholder="studio-mueller.de"
            value={data.website_url}
            onChange={(event) => set("website_url", event.target.value)}
          />
        </Field>
      </div>

      <Field
        id="brief-business_description"
        label="What does your business do?"
        required
        hint="Two or three sentences are plenty: what you offer, to whom, and where."
        error={errors.business_description}
      >
        <Textarea
          {...controlProps("brief-business_description", { hasHint: true, error: errors.business_description })}
          rows={4}
          placeholder="We design and furnish interiors for small cafés and boutiques in Berlin, from concept to installation."
          value={data.business_description}
          onChange={(event) => set("business_description", event.target.value)}
        />
      </Field>
    </div>
  );
}

export function ProjectStep({ data, errors, set }: StepProps) {
  return (
    <div className="grid gap-6">
      <Field
        id="brief-project_type"
        label="What do you need?"
        required
        group
        hint="Example: choose Redesign if you already have a site that feels outdated."
        error={errors.project_type}
      >
        <ChoiceCards name="project_type" options={projectTypes} value={data.project_type} onChange={(value) => set("project_type", value)} />
      </Field>

      <Field
        id="brief-goals"
        label="What should the site achieve?"
        required
        group
        hint="Pick up to 3. Example: a café might choose More leads and Build credibility."
        error={errorFor(errors, "goals")}
      >
        <ChipGroup name="goals" options={goals} values={data.goals} max={BRIEF_LIMITS.goals} onChange={(values) => set("goals", values)} />
      </Field>

      <Field
        id="brief-audience"
        label="Who are your ideal customers?"
        required
        hint="Age, role, what they care about, what they struggle with."
        error={errors.audience}
      >
        <Textarea
          {...controlProps("brief-audience", { hasHint: true, error: errors.audience })}
          rows={3}
          placeholder="Café owners aged 30–50 opening their first or second location. They care about atmosphere and have a tight budget."
          value={data.audience}
          onChange={(event) => set("audience", event.target.value)}
        />
      </Field>

      <Field
        id="brief-primary_action"
        label="The one thing a visitor should do"
        hint="Your main call to action."
        error={errors.primary_action}
      >
        <Input
          {...controlProps("brief-primary_action", { hasHint: true, error: errors.primary_action })}
          placeholder="Book a free 20-minute consultation call"
          value={data.primary_action}
          onChange={(event) => set("primary_action", event.target.value)}
        />
      </Field>

      <Field
        id="brief-competitors"
        label="Competitors or similar businesses"
        hint="Add links if you can, and what you think they do well or badly."
        error={errors.competitors}
      >
        <Textarea
          {...controlProps("brief-competitors", { hasHint: true, error: errors.competitors })}
          rows={3}
          placeholder="interior-berlin.de looks premium but is hard to navigate"
          value={data.competitors}
          onChange={(event) => set("competitors", event.target.value)}
        />
      </Field>
    </div>
  );
}

export function ScopeStep({ data, errors, set }: StepProps) {
  return (
    <div className="grid gap-6">
      <Field
        id="brief-pages"
        label="Which pages do you need?"
        group
        hint="Select everything you think you need. This can change later."
        error={errorFor(errors, "pages")}
      >
        <ChipGroup name="pages" options={pages} values={data.pages} onChange={(values) => set("pages", values)} />
      </Field>

      <Field
        id="brief-features"
        label="Features and integrations"
        group
        hint="Example: a salon would likely pick Online booking and Newsletter."
        error={errorFor(errors, "features")}
      >
        <ChipGroup name="features" options={features} values={data.features} onChange={(values) => set("features", values)} />
      </Field>

      <Field
        id="brief-extra_requirements"
        label="Anything else it must do?"
        error={errors.extra_requirements}
      >
        <Textarea
          {...controlProps("brief-extra_requirements", { error: errors.extra_requirements })}
          rows={3}
          placeholder="Sync bookings with our Google Calendar and send SMS reminders."
          value={data.extra_requirements}
          onChange={(event) => set("extra_requirements", event.target.value)}
        />
      </Field>

      <Field
        id="brief-languages"
        label="Which languages should the site be in?"
        group
        hint="Pick every language your visitors need."
        error={errorFor(errors, "languages")}
      >
        <ChipGroup name="languages" options={languages} values={data.languages} onChange={(values) => set("languages", values)} />
        {data.languages.includes("other") && (
          <Input
            {...controlProps("brief-other_language", { error: errors.other_language })}
            aria-label="Other language"
            className="mt-1 sm:max-w-sm"
            placeholder="e.g. French"
            value={data.other_language}
            onChange={(event) => set("other_language", event.target.value)}
          />
        )}
      </Field>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          id="brief-content_readiness"
          label="How ready is your content?"
          group
          hint="Example: texts written and photos taken, or nothing yet."
          error={errors.content_readiness}
        >
          <ChoiceCards
            name="content_readiness"
            options={contentReadiness}
            value={data.content_readiness}
            onChange={(value) => set("content_readiness", value)}
            variant="pill"
          />
        </Field>
        <Field id="brief-domain_status" label="Domain and hosting" group hint="Example: yourbrand.com plus somewhere to host it." error={errors.domain_status}>
          <ChoiceCards
            name="domain_status"
            options={domainStatus}
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
  return (
    <div className="grid gap-6">
      <Field
        id="brief-brand_assets"
        label="Which brand assets do you already have?"
        group
        error={errorFor(errors, "brand_assets")}
      >
        <ChipGroup name="brand_assets" options={brandAssets} values={data.brand_assets} onChange={(values) => set("brand_assets", values)} />
      </Field>

      <Field
        id="brief-attachments"
        label="Upload your logo or brand files"
        hint="Optional. A logo, a brand guide or screenshots that show what you mean."
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
        label="Which style fits your brand?"
        required
        group
        hint="Pick up to 3. The colours are only a rough hint of each mood."
        error={errorFor(errors, "styles")}
      >
        <ChipGroup name="styles" options={styles} values={data.styles} max={BRIEF_LIMITS.styles} variant="card" onChange={(values) => set("styles", values)} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="brief-brand_words"
          label="Three words that describe your brand"
          error={errors.brand_words}
        >
          <Input
            {...controlProps("brief-brand_words", { error: errors.brand_words })}
            placeholder="calm, crafted, trustworthy"
            value={data.brand_words}
            onChange={(event) => set("brand_words", event.target.value)}
          />
        </Field>
        <Field
          id="brief-colour_preferences"
          label="Colour preferences"
          hint="Colours you love, and any you want to avoid."
          error={errors.colour_preferences}
        >
          <Input
            {...controlProps("brief-colour_preferences", { hasHint: true, error: errors.colour_preferences })}
            placeholder="Deep green and warm sand, please avoid red"
            value={data.colour_preferences}
            onChange={(event) => set("colour_preferences", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field id="brief-colour_mode" label="Light or dark interface?" group error={errors.colour_mode}>
          <ChoiceCards name="colour_mode" options={colourModes} value={data.colour_mode} onChange={(value) => set("colour_mode", value)} variant="pill" />
        </Field>
        <Field id="brief-typography" label="Typography feel" group error={errors.typography}>
          <ChoiceCards name="typography" options={typography} value={data.typography} onChange={(value) => set("typography", value)} variant="pill" />
        </Field>
      </div>

      <Field
        id="brief-liked_sites"
        label="Websites you like"
        group
        hint="Up to 3. Paste the address and tell me what you like about it."
        error={errors.liked_sites}
      >
        <LikedSites baseId="brief-liked" rows={data.liked_sites} max={BRIEF_LIMITS.likedSites} errors={errors} onChange={(rows) => set("liked_sites", rows)} />
      </Field>

      <Field
        id="brief-disliked_sites"
        label="Sites or styles you dislike"
        error={errors.disliked_sites}
      >
        <Textarea
          {...controlProps("brief-disliked_sites", { error: errors.disliked_sites })}
          rows={3}
          placeholder="Cluttered pages with lots of pop-ups and stock photos"
          value={data.disliked_sites}
          onChange={(event) => set("disliked_sites", event.target.value)}
        />
      </Field>
    </div>
  );
}

export function BudgetStep({ data, errors, set }: StepProps) {
  return (
    <div className="grid gap-6">
      <Field
        id="brief-budget"
        label="What budget do you have in mind?"
        required
        group
        hint="Rough numbers are fine. It only helps me suggest the right scope."
        error={errors.budget}
      >
        <ChoiceCards name="budget" options={budgets} value={data.budget} onChange={(value) => set("budget", value)} variant="pill" />
      </Field>

      <Field id="brief-timeline" label="When do you need it?" required group error={errors.timeline}>
        <ChoiceCards name="timeline" options={timelines} value={data.timeline} onChange={(value) => set("timeline", value)} variant="pill" />
      </Field>

      <Field
        id="brief-deadline_note"
        label="Is there a fixed deadline or a reason for the timing?"
        error={errors.deadline_note}
      >
        <Input
          {...controlProps("brief-deadline_note", { error: errors.deadline_note })}
          placeholder="Grand opening on 15 March"
          value={data.deadline_note}
          onChange={(event) => set("deadline_note", event.target.value)}
        />
      </Field>

      <Field id="brief-support" label="Do you want support after launch?" group error={errors.support}>
        <ChoiceCards name="support" options={supportOptions} value={data.support} onChange={(value) => set("support", value)} variant="pill" />
      </Field>

      <Field id="brief-preferred_contact" label="How should I reach you?" required group error={errors.preferred_contact}>
        <ChoiceCards
          name="preferred_contact"
          options={contactMethods}
          value={data.preferred_contact}
          onChange={(value) => set("preferred_contact", value)}
          variant="pill"
        />
      </Field>

      {data.preferred_contact === "phone" && (
        <Field id="brief-phone" label="Phone or WhatsApp number" required error={errors.phone}>
          <Input
            {...controlProps("brief-phone", { error: errors.phone })}
            type="tel"
            autoComplete="tel"
            className="sm:max-w-sm"
            placeholder="+49 151 2345 6789"
            value={data.phone}
            onChange={(event) => set("phone", event.target.value)}
          />
        </Field>
      )}

      <Field id="brief-notes" label="Anything else you would like me to know?" error={errors.notes}>
        <Textarea
          {...controlProps("brief-notes", { error: errors.notes })}
          rows={3}
          placeholder="We would love to see a first concept before committing to the full build."
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
            I agree that my answers are stored and used to reply to this brief.
            <span className="ms-1 text-primary" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
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
