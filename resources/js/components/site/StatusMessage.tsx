import { usePage } from "@inertiajs/react";
import type { PageProps } from "@/types";

export function StatusMessage() {
  const { flash } = usePage<PageProps>().props;
  const message = flash.success ?? flash.status;

  if (!message) return null;

  return (
    <div className="rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
      {message}
    </div>
  );
}
