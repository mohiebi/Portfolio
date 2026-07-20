export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
      unread_notifications_count?: number;
    } | null;
  };
  flash: {
    success?: string | null;
    status?: string | null;
    error?: string | null;
  };
  app: {
    name: string;
  };
};

export type Task = {
  id: number;
  parent_id?: number | null;
  title: string;
  description?: string | null;
  long_description?: string | null;
  deadline?: string | null;
  deadline_warning_reminded_at?: string | null;
  deadline_due_reminded_at?: string | null;
  deadline_overdue_reminded_at?: string | null;
  complete: boolean;
  status?: "open" | "in_progress" | "done";
  done_at?: string | null;
  subtasks?: Task[];
  created_at?: string;
  updated_at?: string;
};

export type Recommendation = {
  id: number;
  name: string;
  role?: string | null;
  company?: string | null;
  relationship?: string | null;
  project?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  linkedin_url?: string | null;
  body: string;
  recommended_at?: string | null;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  translations?: Record<string, Partial<Recommendation>> | null;
};

export type CaseStudyImpact = {
  label: string;
  value: string;
};

export type CaseStudy = {
  id: number;
  slug: string;
  title: string;
  company?: string | null;
  role?: string | null;
  period?: string | null;
  location?: string | null;
  tag?: string | null;
  summary: string;
  accent: string;
  cover: "web3" | "modernize" | "ai" | "web";
  featured_image_path?: string | null;
  featured_image_url?: string | null;
  project_url?: string | null;
  repository_url?: string | null;
  problem?: string | null;
  approach?: string[] | null;
  impact?: CaseStudyImpact[] | null;
  stack?: string[] | null;
  highlights?: string[] | null;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  translations?: Record<string, Partial<CaseStudy>> | null;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category?: string | null;
  cover_path?: string | null;
  cover_url?: string | null;
  published_at?: string | null;
  reading_time: number;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  translations?: Record<string, Partial<Article>> | null;
};

export type ServiceBonus = {
  name: string;
  value: string;
  why: string;
};

export type ServiceGuarantee = {
  name: string;
  detail: string;
};

export type ServiceProject = {
  id?: number;
  name: string;
  slug?: string;
  url: string;
  tag?: string | null;
  summary: string;
  outcome?: string | null;
  preview?: "web" | "design" | "cash" | "tasks" | "routine";
  accent?: string | null;
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  translations?: Record<string, Partial<ServiceProject>> | null;
};

export type Service = {
  id: number;
  slug: string;
  name: string;
  badge?: string | null;
  tagline: string;
  promise: string;
  investment: string;
  timeline: string;
  outcome: string;
  best_for: string;
  benefit: string;
  cover: "launch" | "operations" | "ai";
  accent: string;
  problem: string;
  what_you_get: string;
  why_it_matters: string;
  before?: string[] | null;
  after?: string[] | null;
  deliverables?: string[] | null;
  ai_capabilities?: string[] | null;
  bonuses?: ServiceBonus[] | null;
  guarantees?: ServiceGuarantee[] | null;
  sample_projects?: ServiceProject[] | null;
  sample_projects_count?: number;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  translations?: Record<string, Partial<Service>> | null;
};

export type PaginatedData<T> = {
  data: T[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
  next_page_url?: string | null;
};

export type DatabaseNotification = {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};
