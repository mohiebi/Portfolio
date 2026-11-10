import { useBrief } from "@/components/brief/BriefProvider";
import { OptionTile, type OptionVariant } from "@/components/brief/OptionTile";
import type { BriefOption } from "@/lib/brief";

const layouts = {
  card: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
  pill: "flex flex-wrap gap-2",
} as const;

type ChoiceCardsProps = {
  name: string;
  options: BriefOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: OptionVariant;
};

/** Single choice. */
export function ChoiceCards({ name, options, value, onChange, variant = "card" }: ChoiceCardsProps) {
  return (
    <div role="radiogroup" aria-labelledby={`brief-${name}-label`} className={layouts[variant]}>
      {options.map((option) => (
        <OptionTile
          key={option.value}
          type="radio"
          name={name}
          option={option}
          variant={variant}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

type ChipGroupProps = {
  name: string;
  options: BriefOption[];
  values: string[];
  onChange: (values: string[]) => void;
  /** Maximum number of selections; the remaining options are disabled once it is reached. */
  max?: number;
  variant?: OptionVariant;
};

/** Multiple choice. */
export function ChipGroup({ name, options, values, onChange, max, variant = "pill" }: ChipGroupProps) {
  const { copy, n } = useBrief();
  const limitReached = max !== undefined && values.length >= max;

  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((current) => current !== value) : [...values, value]);
  };

  return (
    <div className="grid gap-2">
      <div className={layouts[variant]}>
        {options.map((option) => {
          const checked = values.includes(option.value);

          return (
            <OptionTile
              key={option.value}
              type="checkbox"
              name={`${name}[]`}
              option={option}
              variant={variant}
              checked={checked}
              disabled={limitReached && !checked}
              onChange={() => toggle(option.value)}
            />
          );
        })}
      </div>
      {max !== undefined && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {copy.common.selectedCount(n(values.length), n(max))}
        </p>
      )}
    </div>
  );
}
