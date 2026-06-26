import { translateText, type Locale } from "@/i18n";

type PageLike = {
  component?: string;
  url?: string;
  props?: Record<string, unknown>;
};

type RecordLike = Record<string, unknown>;

export function formatDocumentTitle(title?: string | null, locale: Locale = "en") {
  if (!title) return "Mohi";

  const localizedTitle = translateText(title, locale);
  const pageTitle = localizedTitle
    .replace(/^Mohi\s*[-—]\s*/i, "")
    .replace(/\s*[-—]\s*Mohi$/i, "")
    .trim();

  return pageTitle ? `Mohi - ${pageTitle}` : "Mohi";
}

export function titleFromInertiaPage(page: PageLike, locale: Locale) {
  const component = page.component ?? "";
  const props = page.props ?? {};

  const article = localizedRecord(propRecord(props, "article"), locale);
  const caseStudy = localizedRecord(propRecord(props, "caseStudy"), locale);
  const service = localizedRecord(propRecord(props, "service"), locale);
  const job = propRecord(props, "job");
  const book = propRecord(props, "book");
  const listing = propRecord(props, "listing");
  const task = propRecord(props, "task");

  if (component === "Portfolio/Home") return "Back-End / Full-Stack Engineer";
  if (component === "Projects/Index") return "Portfolio Projects";

  if (component === "Articles/PublicIndex") return "Technical Articles";
  if (component === "Articles/PublicShow") return suffix(text(article, "title"), locale === "de" ? "Artikel" : "Article");
  if (component === "Articles/Index") return "Manage Articles";
  if (component === "Articles/Create") return "New Article";
  if (component === "Articles/Edit") return "Edit Article";

  if (component === "CaseStudies/PublicIndex") return "Case Study Library";
  if (component === "CaseStudies/PublicShow") return suffix(text(caseStudy, "title"), locale === "de" ? "Fallstudie" : "Case Study");
  if (component === "CaseStudies/Index") return "Manage Case Studies";
  if (component === "CaseStudies/Create") return "New Case Study";
  if (component === "CaseStudies/Edit") return "Edit Case Study";

  if (component === "Recommendations/PublicIndex") return "LinkedIn Recommendations";
  if (component === "Recommendations/Index") return "Manage Recommendations";
  if (component === "Recommendations/Create") return "New Recommendation";
  if (component === "Recommendations/Edit") return "Edit Recommendation";

  if (component === "Services/PublicIndex") return "Service Packages";
  if (component === "Services/PublicShow") return suffix(text(service, "name"), locale === "de" ? "Leistungen" : "Services");
  if (component === "Services/Index") return "Manage Services";
  if (component === "Services/Create") return "New Service";
  if (component === "Services/Edit") return "Edit Service";

  if (component === "Taskmanager/Index") return "taskmanager";
  if (component === "Taskmanager/Show") return text(task, "title");
  if (component === "Taskmanager/Create") return "New Task";
  if (component === "Taskmanager/Edit") return "Edit Task";

  if (component === "Books/Index") return "BookReview Project";
  if (component === "Books/Show") return text(book, "title");
  if (component === "Books/Reviews/Create") {
    const title = text(book, "title");
    return title ? `${locale === "de" ? "Rezension" : "Review"}: ${title}` : locale === "de" ? "Rezension" : "Review";
  }

  if (component === "Jobs/Index") return "Job Board Project";
  if (component === "Jobs/Show") return text(job, "title");
  if (component === "Jobs/Apply") {
    const title = text(job, "title");
    return title ? (locale === "de" ? `Bewerbung: ${title}` : `Apply to ${title}`) : locale === "de" ? "Bewerbung" : "Apply";
  }
  if (component === "Employer/Create") return "Create employer account";
  if (component === "MyJobs/Index") return "My Job Posts";
  if (component === "MyJobs/Create") return "Post a Job";
  if (component === "MyJobs/Edit") return "Edit Job Post";
  if (component === "MyJobApplications/Index") return "My Job Applications";

  if (component === "Listing/Index") return "Real Estate Listings";
  if (component === "Listing/Show") return [text(listing, "street"), text(listing, "city")].filter(Boolean).join(", ");
  if (component === "Realtor/Index") return "My Real Estate Listings";
  if (component === "Realtor/Create") return "Create Real Estate Listing";
  if (component === "Realtor/Edit") return "Edit Real Estate Listing";
  if (component === "Realtor/Image/Create") return "Listing Images";
  if (component === "Realtor/Show") return "Listing Offers";

  if (component === "Dashboard") return "Account Dashboard";
  if (component === "Profile/Edit") return "User Profile";
  if (component === "Notification/Index") return "Notifications";

  if (component === "Auth/Login") return "Log in";
  if (component === "Auth/Register") return "Create account";
  if (component === "Auth/ForgotPassword") return "Forgot password";
  if (component === "Auth/ResetPassword") return "Reset password";
  if (component === "Auth/ConfirmPassword") return "Confirm password";
  if (component === "Auth/VerifyEmail") return "Verify email";

  return titleFromUrl(page.url) ?? titleFromComponent(component);
}

function propRecord(props: Record<string, unknown>, key: string): RecordLike | null {
  const value = props[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value as RecordLike : null;
}

function localizedRecord(record: RecordLike | null, locale: Locale): RecordLike | null {
  if (!record || locale === "en") return record;

  const translations = propRecord(record, "translations");
  const translated = translations ? propRecord(translations, locale) : null;

  return translated ? { ...record, ...translated } : record;
}

function text(record: RecordLike | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : "";
}

function suffix(value: string, label: string) {
  return value ? `${value} - ${label}` : label;
}

function titleFromUrl(url?: string) {
  if (!url) return null;

  const pathname = url.split("?")[0].replace(/^\/+|\/+$/g, "");
  if (!pathname) return "Back-End / Full-Stack Engineer";

  const firstSegment = pathname.split("/")[0];
  if (firstSegment === "taskmanager") return "taskmanager";

  return humanize(firstSegment);
}

function titleFromComponent(component: string) {
  const finalSegment = component.split("/").pop();
  return finalSegment ? humanize(finalSegment) : "Portfolio";
}

function humanize(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
