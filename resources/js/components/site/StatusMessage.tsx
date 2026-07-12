import { usePage } from "@inertiajs/react";
import type { PageProps } from "@/types";

export function StatusMessage() {
  const { flash } = usePage<PageProps>().props;
  const message = flash.success ?? flash.status ?? flash.error;

  if (!message) return null;

  if (flash.error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {message}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
      {message}
    </div>
  );
}
