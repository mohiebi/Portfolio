export type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  reviews: number;
  year: number;
  genre: string;
  blurb: string;
};

export const books: Book[] = [
  { id: 1, title: "The Pragmatic Programmer", author: "Andy Hunt & Dave Thomas", cover: "https://covers.openlibrary.org/b/id/8226191-L.jpg", rating: 4.7, reviews: 1820, year: 1999, genre: "Engineering", blurb: "Timeless techniques and habits for modern software craftsmanship." },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", cover: "https://covers.openlibrary.org/b/id/8410325-L.jpg", rating: 4.5, reviews: 2410, year: 2008, genre: "Engineering", blurb: "Principles, patterns and practices of writing code that lasts." },
  { id: 3, title: "Domain-Driven Design", author: "Eric Evans", cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg", rating: 4.4, reviews: 980, year: 2003, genre: "Architecture", blurb: "Tackling complexity in the heart of software." },
  { id: 4, title: "Refactoring", author: "Martin Fowler", cover: "https://covers.openlibrary.org/b/id/8235116-L.jpg", rating: 4.6, reviews: 1320, year: 1999, genre: "Engineering", blurb: "Improving the design of existing code, step by step." },
  { id: 5, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", cover: "https://covers.openlibrary.org/b/id/9259256-L.jpg", rating: 4.8, reviews: 3120, year: 2017, genre: "Systems", blurb: "The big ideas behind reliable, scalable, maintainable systems." },
  { id: 6, title: "You Don't Know JS", author: "Kyle Simpson", cover: "https://covers.openlibrary.org/b/id/8156145-L.jpg", rating: 4.3, reviews: 770, year: 2014, genre: "JavaScript", blurb: "Deep dives into JavaScript's core mechanisms." },
];

export type Task = {
  id: number;
  title: string;
  description: string;
  long_description: string;
  complete: boolean;
  created: string;
};

export const tasks: Task[] = [
  { id: 1, title: "Polish portfolio hero copy", description: "Tighten the headline and CTA wording.", long_description: "Iterate on the headline, subheading and call-to-action so it reads with conviction in under 5 seconds.", complete: false, created: "2 days ago" },
  { id: 2, title: "Refactor BookController filters", description: "Extract filter scopes from controller into the model.", long_description: "Move popular_last_month and highest_rated_last_6_months scopes into Eloquent local scopes.", complete: true, created: "5 days ago" },
  { id: 3, title: "Write README for Job Board", description: "Document setup, seed data, and demo accounts.", long_description: "Include screenshots, env vars, and a small architecture diagram.", complete: false, created: "1 week ago" },
  { id: 4, title: "Add Pest tests for Auth", description: "Cover login, register, password reset.", long_description: "", complete: false, created: "1 week ago" },
];

export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: number;
  experience: "entry" | "intermediate" | "senior";
  category: "IT" | "Finance" | "Sales" | "Marketing";
  posted: string;
  description: string;
};

export const jobs: Job[] = [
  { id: 1, title: "Senior Laravel Engineer", company: "Northwind Labs", location: "Remote · EU", salary: 85000, experience: "senior", category: "IT", posted: "2d ago", description: "Lead backend work on a multi-tenant SaaS built with Laravel and Inertia." },
  { id: 2, title: "Full-Stack Developer", company: "Bright Finance", location: "Berlin, DE", salary: 62000, experience: "intermediate", category: "Finance", posted: "4d ago", description: "Build dashboards and internal tooling for a fintech with strong UX standards." },
  { id: 3, title: "Junior PHP Developer", company: "Atlas CMS", location: "Remote", salary: 32000, experience: "entry", category: "IT", posted: "1w ago", description: "Contribute to an open-source CMS — tickets, plugins, and Blade components." },
  { id: 4, title: "Marketing Site Engineer", company: "Loop & Co", location: "Lisbon, PT", salary: 48000, experience: "intermediate", category: "Marketing", posted: "1w ago", description: "Own the marketing site, A/B tests, CMS integrations, and performance." },
  { id: 5, title: "Sales Engineer", company: "Pipeline OS", location: "Remote · US", salary: 78000, experience: "senior", category: "Sales", posted: "3d ago", description: "Bridge prospects and engineering — demos, integrations, and PoCs." },
  { id: 6, title: "DevOps Engineer", company: "Cloudforge", location: "London, UK", salary: 90000, experience: "senior", category: "IT", posted: "5d ago", description: "Own CI/CD, observability, and infra-as-code for a Laravel platform." },
];

export type Application = {
  id: number;
  jobId: number;
  status: "pending" | "reviewed" | "rejected";
  expected_salary: number;
  applied: string;
};

export const applications: Application[] = [
  { id: 1, jobId: 1, status: "pending", expected_salary: 90000, applied: "2d ago" },
  { id: 2, jobId: 4, status: "reviewed", expected_salary: 50000, applied: "1w ago" },
];
