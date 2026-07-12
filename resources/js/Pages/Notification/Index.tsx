import { Head, Link } from "@inertiajs/react";
import { AlertTriangle, Bell, CalendarClock } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import type { DatabaseNotification, PaginatedData } from "@/types";

interface Props {
  notifications: PaginatedData<DatabaseNotification>;
}

export default function NotificationIndex({ notifications }: Props) {
  return (
    <SiteShell>
      <Head title="Notifications" />
      <PageHeader eyebrow="Activity" title="Your notifications" />

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {notifications.data.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="Task reminders and project activity will appear here." />
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {notifications.data.map((n) => {
              const item = notificationContent(n);

              return (
                <div key={n.id} className={`flex items-center justify-between px-5 py-4 ${n.read_at ? "opacity-60" : ""}`}>
                  <div className="flex min-w-0 items-start gap-3 text-sm">
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.iconClass}`}>
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      {item.content}
                      <p className="mt-0.5 text-xs text-muted-foreground">{new Date(n.created_at).toDateString()}</p>
                    </div>
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

function notificationContent(notification: DatabaseNotification) {
  if (notification.type === "App\\Notifications\\OfferMade") {
    const data = notification.data as { amount?: number; listing_id?: number };

    return {
      icon: Bell,
      iconClass: "bg-primary/15 text-primary",
      content: (
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
      ),
    };
  }

  if (notification.type === "App\\Notifications\\TaskDeadlineReminder") {
    const data = notification.data as {
      title?: string;
      stage?: "warning" | "due" | "overdue";
      url?: string;
    };
    const overdue = data.stage === "overdue";
    const dueToday = data.stage === "due";
    const label = overdue ? "Overdue task" : dueToday ? "Task due today" : "Task due tomorrow";
    const href = data.url ?? "/taskmanager";

    return {
      icon: overdue || dueToday ? AlertTriangle : CalendarClock,
      iconClass: overdue || dueToday ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning",
      content: (
        <span>
          {label}:{" "}
          <Link href={href} className="font-semibold text-primary hover:underline">
            {data.title ?? "Untitled task"}
          </Link>
        </span>
      ),
    };
  }

  return {
    icon: Bell,
    iconClass: "bg-muted text-muted-foreground",
    content: <span>New notification</span>,
  };
}
