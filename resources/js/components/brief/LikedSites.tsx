import { Plus, X } from "lucide-react";
import { useBrief } from "@/components/brief/BriefProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BriefLikedSite } from "@/lib/brief";

type LikedSitesProps = {
  baseId: string;
  rows: BriefLikedSite[];
  max: number;
  /** Inertia validation errors, keyed like `liked_sites.0.url`. */
  errors: Record<string, string | undefined>;
  onChange: (rows: BriefLikedSite[]) => void;
};

export function LikedSites({ baseId, rows, max, errors, onChange }: LikedSitesProps) {
  const { copy, n } = useBrief();

  const update = (index: number, patch: Partial<BriefLikedSite>) => {
    onChange(rows.map((row, current) => (current === index ? { ...row, ...patch } : row)));
  };

  const remove = (index: number) => {
    const next = rows.filter((_, current) => current !== index);
    onChange(next.length > 0 ? next : [{ url: "", note: "" }]);
  };

  return (
    <div className="grid gap-3">
      {rows.map((row, index) => {
        const urlError = errors[`liked_sites.${index}.url`];
        const noteError = errors[`liked_sites.${index}.note`];
        const canRemove = rows.length > 1 || row.url !== "" || row.note !== "";
        const position = n(index + 1);

        return (
          <div key={index} className="grid gap-2 rounded-xl border border-border bg-background/40 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-start">
            <div className="grid gap-1">
              <Input
                id={`${baseId}-${index}-url`}
                type="text"
                inputMode="url"
                dir="ltr"
                aria-label={copy.likedSites.addressLabel(position)}
                aria-invalid={urlError ? true : undefined}
                placeholder={copy.likedSites.urlPlaceholder}
                value={row.url}
                onChange={(event) => update(index, { url: event.target.value })}
              />
              {urlError && (
                <p role="alert" className="text-xs text-destructive">
                  {urlError}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Input
                id={`${baseId}-${index}-note`}
                aria-label={copy.likedSites.noteLabel(position)}
                aria-invalid={noteError ? true : undefined}
                placeholder={copy.likedSites.notePlaceholder}
                value={row.note}
                onChange={(event) => update(index, { note: event.target.value })}
              />
              {noteError && (
                <p role="alert" className="text-xs text-destructive">
                  {noteError}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={!canRemove}
              aria-label={copy.likedSites.remove(position)}
              className="grid h-10 w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}

      {rows.length < max && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() => onChange([...rows, { url: "", note: "" }])}
        >
          <Plus className="me-2 h-4 w-4" aria-hidden="true" /> {copy.likedSites.add}
        </Button>
      )}
    </div>
  );
}
