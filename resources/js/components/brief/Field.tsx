import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FieldProps = {
  /** DOM id of the control, or of the group when `group` is set. */
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** Use for radio / checkbox groups and other composite controls. */
  group?: boolean;
  children: ReactNode;
};

export function Field({ id, label, required = false, hint, error, group = false, children }: FieldProps) {
  const labelContent = (
    <>
      {label}
      {required && (
        <span className="ms-1 text-primary" aria-hidden="true">
          *
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </>
  );

  return (
    <div
      className="grid content-start gap-2"
      data-invalid={error ? "true" : undefined}
      {...(group ? { role: "group", "aria-labelledby": `${id}-label` } : {})}
    >
      {group ? (
        <p id={`${id}-label`} className="text-sm font-medium leading-none">
          {labelContent}
        </p>
      ) : (
        <Label htmlFor={id}>{labelContent}</Label>
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Wires a control to the hint and error rendered by <Field>. */
export function controlProps(id: string, { hasHint = false, error }: { hasHint?: boolean; error?: string }) {
  const describedBy = [hasHint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  } as const;
}
