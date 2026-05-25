export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
      employer?: Employer | null;
    } | null;
  };
  flash: {
    success?: string | null;
    status?: string | null;
  };
  app: {
    name: string;
  };
};

export type Employer = {
  id: number;
  company_name: string;
  user_id?: number;
};

export type Review = {
  id: number;
  review: string;
  rating: number;
  created_at?: string;
};

export type Book = {
  id: number;
  title: string;
  author: string;
  reviews_count?: number;
  reviews_avg_rating?: number | string | null;
  reviews?: Review[];
  created_at?: string;
};

export type Job = {
  id: number;
  title: string;
  description: string;
  salary: number;
  location: string;
  category: string;
  experience: string;
  created_at?: string;
  employer?: Employer;
  job_applications_count?: number;
  job_applications_avg_expected_salary?: number | string | null;
  has_applied?: boolean;
};

export type Task = {
  id: number;
  parent_id?: number | null;
  title: string;
  description?: string | null;
  long_description?: string | null;
  complete: boolean;
  status?: "open" | "in_progress" | "done";
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
  problem?: string | null;
  approach?: string[] | null;
  impact?: CaseStudyImpact[] | null;
  stack?: string[] | null;
  highlights?: string[] | null;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type JobApplication = {
  id: number;
  expected_salary: number;
  created_at?: string;
  job: Job;
};
