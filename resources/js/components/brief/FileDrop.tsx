import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, ImagePlus, X } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const addFiles = (incoming: File[]) => {
    const problems: string[] = [];
    const accepted: File[] = [];

    for (const file of incoming) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

      if (!extensions.includes(extension)) {
        problems.push(`${file.name}: only ${extensions.join(", ").toUpperCase()} files are accepted.`);
      } else if (file.size > maxMb * 1024 * 1024) {
        problems.push(`${file.name}: files must be ${maxMb} MB or smaller.`);
      } else if (files.length + accepted.length >= max) {
        problems.push(`${file.name}: you can upload up to ${max} files.`);
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
        <span className="font-medium">Drop files here or click to browse</span>
        <span className="text-xs text-muted-foreground">
          Logo, brand guide or inspiration. {extensions.join(", ").toUpperCase()} up to {maxMb} MB each, max {max} files.
        </span>
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
        <ul className="grid gap-2" aria-label="Selected files">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatSize(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${file.name}`}
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
