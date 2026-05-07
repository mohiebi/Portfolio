import { Link } from "@inertiajs/react";
import { Mail, Linkedin, Send, FileDown } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="font-display text-lg font-semibold">Mohi</div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Web developer crafting Laravel and NestJS backends with Vue frontends. Available for freelance and full-time work.
          </p>
          <a
            href="/CV/MHEbrahimi_CV.pdf"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-accent"
          >
            <FileDown className="h-4 w-4" /> Download CV
          </a>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projects</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/books" className="hover:text-foreground text-muted-foreground">BookReview</Link></li>
            <li><Link href="/taskmanager" className="hover:text-foreground text-muted-foreground">TaskManager</Link></li>
            <li><Link href="/jobs" className="hover:text-foreground text-muted-foreground">Job Board</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="mailto:e.mohamadhosein@gmail.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><Mail className="h-4 w-4" />Email</a></li>
            <li><a href="https://www.linkedin.com/in/mohiebi" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><Linkedin className="h-4 w-4" />LinkedIn</a></li>
            <li><a href="https://t.me/emohamadhosein" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><Send className="h-4 w-4" />Telegram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Mohi. All rights reserved.</p>
          <p className="font-mono">Laravel &middot; NestJS &middot; Vue &middot; Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
