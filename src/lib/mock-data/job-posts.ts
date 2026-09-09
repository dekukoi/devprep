import type { JobPost, JobPostRequirement, UnresolvedRequirement } from "@/types/job-post";
import { mockUser } from "./user";

export const jobPosts: JobPost[] = [
  {
    id: "job-acme",
    userId: mockUser.id,
    title: "Senior Backend Engineer",
    company: "Acme App",
    content: [
      "About the role",
      "Acme App is building the next generation of developer tooling and we're looking for a Senior Backend Engineer to own core services powering our API platform. You'll design, build, and scale systems that serve millions of requests per day.",
      "Responsibilities",
      "Design and implement RESTful and GraphQL APIs in Python and Django. Own data models in PostgreSQL, optimize slow queries, and improve reliability. Build CI/CD pipelines and deploy containerized services to AWS. Collaborate closely with frontend and product teams.",
      "Requirements",
      "5+ years of professional backend experience with Python and Django. Strong understanding of relational databases (PostgreSQL) and REST API design. Hands-on experience with Docker, AWS, and CI/CD workflows. Bonus: Kubernetes, Redis, Celery, and Terraform.",
    ].join("\n\n"),
    seniority: "Senior",
    location: "Remote (US)",
    employmentType: "Full-time",
    salaryRange: "$150k – $185k",
    createdAt: "2026-07-10T08:00:00.000Z",
  },
  {
    id: "job-globex",
    userId: mockUser.id,
    title: "Frontend Engineer",
    company: "Globex API",
    content:
      "Globex API is hiring a Frontend Engineer to build the developer console for our public API platform, working closely with design and backend teams in React and TypeScript.",
    seniority: "Mid-level",
    location: "Remote (US)",
    employmentType: "Full-time",
    salaryRange: "$120k – $145k",
    createdAt: "2026-07-08T08:00:00.000Z",
  },
  {
    id: "job-initech",
    userId: mockUser.id,
    title: "Full-Stack Developer",
    company: "Initech Platform",
    content:
      "Initech Platform is looking for a Full-Stack Developer comfortable across a Node.js/Next.js frontend and a Python services backend to help ship new billing features.",
    seniority: "Mid-level",
    location: "Austin, TX (Hybrid)",
    employmentType: "Full-time",
    salaryRange: "$110k – $135k",
    createdAt: "2026-07-05T08:00:00.000Z",
  },
  {
    id: "job-umbrella",
    userId: mockUser.id,
    title: "Backend Engineer",
    company: "Umbrella Health",
    content:
      "Umbrella Health needs a Backend Engineer to build HIPAA-compliant services for patient scheduling, primarily in Python with PostgreSQL and AWS.",
    seniority: "Senior",
    location: "Remote (US)",
    employmentType: "Full-time",
    salaryRange: "$140k – $170k",
    createdAt: "2026-06-28T08:00:00.000Z",
  },
  {
    id: "job-stark",
    userId: mockUser.id,
    title: "Platform Engineer",
    company: "Stark Industries",
    content:
      "Stark Industries is scaling out its internal platform team and wants a Platform Engineer with strong Kubernetes and Terraform experience.",
    seniority: "Senior",
    location: "New York, NY (Onsite)",
    employmentType: "Full-time",
    salaryRange: "$155k – $190k",
    createdAt: "2026-06-20T08:00:00.000Z",
  },
  {
    id: "job-wayne",
    userId: mockUser.id,
    title: "Senior Software Engineer",
    company: "Wayne Enterprises",
    content:
      "Wayne Enterprises is hiring a Senior Software Engineer for its logistics division, working across Go microservices and a React front end.",
    seniority: "Senior",
    location: "Gotham, NJ (Hybrid)",
    employmentType: "Full-time",
    salaryRange: "$145k – $180k",
    createdAt: "2026-06-12T08:00:00.000Z",
  },
];

export const jobPostRequirements: JobPostRequirement[] = [
  { id: "req-acme-kubernetes", jobPostId: "job-acme", skillId: "skill-kubernetes", requiredLevel: "INTERMEDIATE", mustHave: false, weight: 3 },
  { id: "req-acme-graphql", jobPostId: "job-acme", skillId: "skill-graphql", requiredLevel: "INTERMEDIATE", mustHave: true, weight: 3 },
  { id: "req-acme-postgresql", jobPostId: "job-acme", skillId: "skill-postgresql", requiredLevel: "ADVANCED", mustHave: true, weight: 3 },
  { id: "req-acme-aws", jobPostId: "job-acme", skillId: "skill-aws", requiredLevel: "ADVANCED", mustHave: true, weight: 2 },
  { id: "req-acme-docker", jobPostId: "job-acme", skillId: "skill-docker", requiredLevel: "INTERMEDIATE", mustHave: true, weight: 2 },
  { id: "req-acme-nodejs", jobPostId: "job-acme", skillId: "skill-nodejs", requiredLevel: "INTERMEDIATE", mustHave: false, weight: 1 },
  { id: "req-acme-typescript", jobPostId: "job-acme", skillId: "skill-typescript", requiredLevel: "INTERMEDIATE", mustHave: false, weight: 1 },
  { id: "req-acme-rest-api-design", jobPostId: "job-acme", skillId: "skill-rest-api-design", requiredLevel: "INTERMEDIATE", mustHave: true, weight: 2 },
  { id: "req-acme-git-cicd", jobPostId: "job-acme", skillId: "skill-git-cicd", requiredLevel: "INTERMEDIATE", mustHave: false, weight: 1 },
];

export const unresolvedRequirements: UnresolvedRequirement[] = [
  { id: "unres-acme-reliability", jobPostId: "job-acme", phrase: "Site reliability practices" },
  { id: "unres-acme-oncall", jobPostId: "job-acme", phrase: "On-call rotations" },
  { id: "unres-acme-agile", jobPostId: "job-acme", phrase: "Agile ceremonies" },
];
