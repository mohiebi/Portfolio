import { Head, Link } from "@inertiajs/react";
import { Bell } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import type { DatabaseNotification, PaginatedData } from "@/types";

interface Props {
  notifications: PaginatedData<DatabaseNotification>;
}

export default function NotificationIndex({ notifications }: Props) {
  return (
    <SiteShell>
      <Head title="Notifications" />
      <PageHeader eyebrow="Real Estate" title="Your Notifications" />

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {notifications.data.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You'll be notified when activity happens on your listings." />
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {notifications.data.map((n) => {
              const data = n.data as { amount?: number; listing_id?: number };
              return (
                <div key={n.id} className={`flex items-center justify-between px-5 py-4 ${n.read_at ? "opacity-60" : ""}`}>
                  <div className="text-sm">
                    {n.type === "App\\Notifications\\OfferMade" ? (
                      <span>
                        Offer of{" "}
                        <strong>
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.amount ?? 0)}
                        </strong>{" "}
                        was made for{" "}
                        <Link href={route("realtor.listing.show", { listing: data.listing_id })} className="text-primary hover:underline">
                          listing
                        </Link>
                      </span>
                    ) : (
                      <span>New notification</span>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">{new Date(n.created_at).toDateString()}</p>
                  </div>

                  {!n.read_at && (
                    <Link
                      href={route("notification.seen", { notification: n.id })}
                      method="put" as="button"
                      className="ml-4 shrink-0 rounded-md border border-border px-3 py-1 text-xs font-medium uppercase hover:bg-accent"
                    >
                      Mark as read
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {notifications.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-1">
            {notifications.links.map((link, i) => (
              link.url ? (
                <Link key={i} href={link.url}
                  className={`rounded-md border px-3 py-1.5 text-sm ${link.active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <span key={i} className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-40" dangerouslySetInnerHTML={{ __html: link.label }} />
              )
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
