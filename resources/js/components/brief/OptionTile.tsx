import { Check } from "lucide-react";
import type { BriefOption } from "@/lib/brief";

export type OptionVariant = "pill" | "card";

type OptionTileProps = {
  type: "radio" | "checkbox";
  name: string;
  option: BriefOption;
  checked: boolean;
  disabled?: boolean;
  variant?: OptionVariant;
  onChange: () => void;
};

/**
 * One selectable answer. A real radio / checkbox sits (visually hidden) in front of the
 * styled tile, so keyboard navigation, screen readers and form semantics come for free.
 */
export function OptionTile({ type, name, option, checked, disabled = false, variant = "card", onChange }: OptionTileProps) {
  const base =
    "block h-full border text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-40";
  const idle = "border-border bg-background/50 hover:border-primary/40";

  return (
    <label className={`relative ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type={type}
        name={name}
        value={option.value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />

      {variant === "pill" ? (
        <span className={`${base} ${idle} flex items-center gap-2 rounded-full px-4 py-2`}>
          <Check
            aria-hidden="true"
            className={`h-3.5 w-3.5 shrink-0 text-primary transition-opacity ${checked ? "opacity-100" : "hidden opacity-0"}`}
          />
          <span>{option.label}</span>
        </span>
      ) : (
        <span className={`${base} ${idle} rounded-xl px-4 py-3`}>
          {option.swatch && (
            <span aria-hidden="true" className="mb-3 flex h-6 overflow-hidden rounded-md border border-border/60">
              {option.swatch.map((colour) => (
                <span key={colour} className="flex-1" style={{ backgroundColor: colour }} />
              ))}
            </span>
          )}
          <span className="block pe-6 font-medium">{option.label}</span>
          {option.hint && <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint}</span>}
          <span
            aria-hidden="true"
            className={`absolute end-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground shadow transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        </span>
      )}
    </label>
  );
}
