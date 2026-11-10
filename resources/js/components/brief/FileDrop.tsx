import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, ImagePlus, X } from "lucide-react";
import { useBrief } from "@/components/brief/BriefProvider";

type FileDropProps = {
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
  max: number;
  maxMb: number;
  accept: string;
  extensions: string[];
  /** Error returned by the server for this field. */
  error?: string;
  describedBy?: string;
};

export function FileDrop({ id, files, onChange, max, maxMb, accept, extensions, error, describedBy }: FileDropProps) {
  const { copy, n } = useBrief();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const typeList = extensions.join(", ").toUpperCase();

  const addFiles = (incoming: File[]) => {
    const problems: string[] = [];
    const accepted: File[] = [];

    for (const file of incoming) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

      if (!extensions.includes(extension)) {
        problems.push(copy.files.wrongType(file.name, typeList));
      } else if (file.size > maxMb * 1024 * 1024) {
        problems.push(copy.files.tooLarge(file.name, n(maxMb)));
      } else if (files.length + accepted.length >= max) {
        problems.push(copy.files.tooMany(file.name, n(max)));
      } else {
        accepted.push(file);
      }
    }

    setLocalError(problems.length > 0 ? problems.join(" ") : null);

    if (accepted.length > 0) onChange([...files, ...accepted]);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    // Reset so choosing the same file again still fires a change event.
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const remove = (index: number) => {
    setLocalError(null);
    onChange(files.filter((_, current) => current !== index));
    inputRef.current?.focus();
  };

  const message = localError ?? error;

  return (
    <div className="grid gap-3">
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center text-sm transition-colors focus-within:ring-2 focus-within:ring-ring ${
          dragging ? "border-primary bg-primary/10" : "border-border bg-background/50 hover:border-primary/60"
        }`}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-medium">{copy.files.dropTitle}</span>
        <span className="text-xs text-muted-foreground">{copy.files.dropHelp(typeList, n(maxMb), n(max))}</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          aria-describedby={describedBy}
          onChange={handleInput}
        />
      </label>

      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}

      {files.length > 0 && (
        <ul className="grid gap-2" aria-label={copy.files.selected}>
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <bdi className="truncate">{file.name}</bdi>
                <bdi className="shrink-0 text-xs text-muted-foreground">{formatSize(file.size)}</bdi>
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={copy.files.remove(file.name)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
