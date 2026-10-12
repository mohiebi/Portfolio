import { Head, router, useForm, usePage } from "@inertiajs/react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/site/StatusMessage";
import type { PageProps } from "@/types";
import { Bell, BellOff, Bot, Check, ChevronDown, Copy, Link, MessageCircle, Unlink } from "lucide-react";
import { useState } from "react";

type McpProfile = {
  server_url: string;
  connections: Array<{ client_id: string; name: string; connected_at: string | null }>;
};

type TelegramProfile = {
  bot_username?: string | null;
  connected: boolean;
  username?: string | null;
  connected_at?: string | null;
  reminders_enabled: boolean;
};

type TaskReminderSchedule = {
  time: string;
  timezone: string;
  timezone_options: Array<{ value: string; label: string }>;
};

export default function ProfilePage() {
  const { auth, telegram, taskReminderSchedule, mcp } = usePage<PageProps<{ telegram: TelegramProfile; taskReminderSchedule: TaskReminderSchedule; mcp: McpProfile }>>().props;
  const user = auth.user!;
  const [mcpUrlCopied, setMcpUrlCopied] = useState(false);
  const mcpDisconnect = useForm({});

  const copyMcpUrl = async () => {
    try {
      await navigator.clipboard.writeText(mcp.server_url);
      setMcpUrlCopied(true);
      window.setTimeout(() => setMcpUrlCopied(false), 2000);
    } catch {
      setMcpUrlCopied(false);
    }
  };
  const profile = useForm({ name: user.name, email: user.email });
  const password = useForm({ current_password: "", password: "", password_confirmation: "" });
  const destroy = useForm({ password: "" });
  const telegramConnect = useForm({});
  const telegramDisconnect = useForm({});
  const reminderSchedule = useForm({
    time: taskReminderSchedule.time,
    timezone: taskReminderSchedule.timezone,
  });
  const [telegramReminderProcessing, setTelegramReminderProcessing] = useState(false);

  const submitReminderPreference = (enabled: boolean) => {
    router.patch("/profile/telegram/reminders", { reminders_enabled: enabled }, {
      preserveScroll: true,
      onStart: () => setTelegramReminderProcessing(true),
      onFinish: () => setTelegramReminderProcessing(false),
    });
  };

  const submitReminderSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reminderSchedule.patch("/profile/task-reminder-schedule", { preserveScroll: true });
  };

  return (
    <SiteShell>
      <Head title="User Profile" />
      <PageHeader eyebrow="Account" title="Profile" description="Manage your personal info, password and account." />
      <section className="mx-auto grid max-w-3xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />
        <Card title="Profile information" description="Update your account's profile information and email address.">
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); profile.patch("/profile"); }}>
            <Field label="Name" error={profile.errors.name}><Input value={profile.data.name} onChange={(event) => profile.setData("name", event.target.value)} /></Field>
            <Field label="Email" error={profile.errors.email}><Input type="email" value={profile.data.email} onChange={(event) => profile.setData("email", event.target.value)} /></Field>
            <div className="flex justify-end"><Button disabled={profile.processing}>Save</Button></div>
          </form>
        </Card>
        <Card title="Update password" description="Use a long, random password to keep your account secure.">
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); password.put("/password", { onSuccess: () => password.reset() }); }}>
            <Field label="Current password" error={password.errors.current_password}><Input type="password" value={password.data.current_password} onChange={(event) => password.setData("current_password", event.target.value)} /></Field>
            <Field label="New password" error={password.errors.password}><Input type="password" value={password.data.password} onChange={(event) => password.setData("password", event.target.value)} /></Field>
            <Field label="Confirm" error={password.errors.password_confirmation}><Input type="password" value={password.data.password_confirmation} onChange={(event) => password.setData("password_confirmation", event.target.value)} /></Field>
            <div className="flex justify-end"><Button disabled={password.processing}>Update password</Button></div>
          </form>
        </Card>
        <Card title="Telegram bot" description="Connect Telegram to view tasks and receive daily deadline reminders.">
          <div className="grid gap-5">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {telegram.connected ? "Telegram connected" : "Telegram not connected"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {telegram.connected
                      ? telegram.username
                        ? `Connected as @${telegram.username}`
                        : "Connected to your Telegram chat"
                      : telegram.bot_username
                        ? `Bot: @${telegram.bot_username}`
                        : "Set TELEGRAM_BOT_USERNAME before connecting."}
                  </p>
                </div>
              </div>
              {telegram.connected ? (
                <form onSubmit={(event) => { event.preventDefault(); telegramDisconnect.delete("/profile/telegram", { preserveScroll: true }); }}>
                  <Button type="submit" variant="outline" disabled={telegramDisconnect.processing}>
                    <Unlink className="mr-2 size-4" aria-hidden="true" />
                    Disconnect
                  </Button>
                </form>
              ) : (
                <form onSubmit={(event) => { event.preventDefault(); telegramConnect.post("/profile/telegram/connect"); }}>
                  <Button type="submit" disabled={telegramConnect.processing || !telegram.bot_username}>
                    <Link className="mr-2 size-4" aria-hidden="true" />
                    Connect Telegram
                  </Button>
                </form>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-warning/30 bg-warning/10 text-warning">
                  {telegram.reminders_enabled ? <Bell className="size-5" aria-hidden="true" /> : <BellOff className="size-5" aria-hidden="true" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">Daily Telegram reminders</p>
                  <p className="text-sm text-muted-foreground">One grouped message at 7:00 AM Tehran time when tasks need attention.</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={!telegram.connected || telegramReminderProcessing}
                onClick={() => submitReminderPreference(!telegram.reminders_enabled)}
              >
                {telegram.reminders_enabled ? <BellOff className="mr-2 size-4" aria-hidden="true" /> : <Bell className="mr-2 size-4" aria-hidden="true" />}
                {telegram.reminders_enabled ? "Disable" : "Enable"}
              </Button>
            </div>

            <form className="grid gap-4 rounded-lg border border-border bg-muted/20 p-4" onSubmit={submitReminderSchedule}>
              <div>
                <p className="text-sm font-semibold">Reminder time</p>
                <p className="text-sm text-muted-foreground">Used for email and Telegram deadline reminders. The hourly job sends during the selected local hour.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                <Field label="Time" error={reminderSchedule.errors.time}>
                  <Input
                    type="time"
                    step="60"
                    value={reminderSchedule.data.time}
                    onChange={(event) => reminderSchedule.setData("time", event.target.value)}
                    className="[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:filter hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                </Field>
                <Field label="Timezone" error={reminderSchedule.errors.timezone}>
                  <div className="relative">
                    <select
                      className="h-10 w-full appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                      value={reminderSchedule.data.timezone}
                      onChange={(event) => reminderSchedule.setData("timezone", event.target.value)}
                    >
                      {taskReminderSchedule.timezone_options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </Field>
                <Button type="submit" disabled={reminderSchedule.processing}>
                  Save time
                </Button>
              </div>
            </form>
          </div>
        </Card>
        <Card title="AI assistant" description="Let Claude, ChatGPT, Cursor or any MCP-compatible assistant read and manage your tasks while you chat.">
          <div className="grid gap-5">
            <div className="grid gap-3 rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Bot className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">MCP server address</p>
                  <p className="text-sm text-muted-foreground">Add this URL as a custom connector, then sign in and approve access when asked.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input readOnly value={mcp.server_url} aria-label="MCP server URL" className="font-mono text-xs" onFocus={(event) => event.currentTarget.select()} />
                <Button type="button" variant="outline" onClick={copyMcpUrl}>
                  {mcpUrlCopied ? <Check className="mr-2 size-4" aria-hidden="true" /> : <Copy className="mr-2 size-4" aria-hidden="true" />}
                  {mcpUrlCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              <ul className="grid gap-1.5 text-sm text-muted-foreground">
                <li><span className="font-medium text-foreground">Claude:</span> Settings → Connectors → Add custom connector.</li>
                <li><span className="font-medium text-foreground">ChatGPT:</span> Settings → Connectors → add a custom MCP connector.</li>
                <li><span className="font-medium text-foreground">Claude Code:</span> <code className="rounded bg-muted px-1 py-0.5 text-xs">claude mcp add --transport http tasks {mcp.server_url}</code></li>
                <li><span className="font-medium text-foreground">Cursor / VS Code:</span> add an HTTP MCP server with this URL.</li>
              </ul>
            </div>

            <div className="grid gap-3">
              <p className="text-sm font-semibold">Connected assistants</p>
              {mcp.connections.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">No AI assistants are connected yet.</p>
              ) : (
                mcp.connections.map((connection) => (
                  <div key={connection.client_id} className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{connection.name}</p>
                      {connection.connected_at && (
                        <p className="text-sm text-muted-foreground">Connected {new Date(connection.connected_at).toLocaleDateString()}</p>
                      )}
                    </div>
                    <form onSubmit={(event) => { event.preventDefault(); mcpDisconnect.delete(`/profile/mcp/${connection.client_id}`, { preserveScroll: true }); }}>
                      <Button type="submit" variant="outline" disabled={mcpDisconnect.processing}>
                        <Unlink className="mr-2 size-4" aria-hidden="true" />
                        Disconnect
                      </Button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
        <Card title="Delete account" description="This action is permanent and cannot be undone." tone="danger">
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); destroy.delete("/profile"); }}>
            <Field label="Password" error={destroy.errors.password}><Input type="password" value={destroy.data.password} onChange={(event) => destroy.setData("password", event.target.value)} /></Field>
            <Button variant="ghost" className="justify-self-start text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={destroy.processing}>Delete my account</Button>
          </form>
        </Card>
      </section>
    </SiteShell>
  );
}

function Card({ title, description, children, tone }: { title: string; description?: string; children: React.ReactNode; tone?: "danger" }) {
  return <div className={`rounded-2xl border bg-card p-6 sm:p-8 ${tone === "danger" ? "border-destructive/40" : "border-border"}`}><h2 className="font-display text-lg font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}<div className="mt-5">{children}</div></div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
