export type Domain = "Climate" | "Health" | "Education" | "Community";

export type ProjectStatus = "shipped" | "pilot" | "prototype" | "research";

export type SortKey = "recent" | "impact" | "alpha";

export type ViewMode = "grid" | "list";

export interface Metric {
  label: string;
  value: number;
  unit?: string;
  delta?: string;
  projected?: boolean;
}

export interface PullStat {
  value: string;
  caption: string;
  source: string;
}

export interface BuildMilestone {
  date: string;
  title: string;
  body: string;
}

export interface CodeSnippet {
  filename: string;
  language: string;
  code: string;
}

export interface ProjectLinks {
  demo?: string;
  github?: string;
  paper?: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  domain: Domain;
  status: ProjectStatus;
  startedAt: string;
  tech: string[];
  problem: string[];
  pullStat: PullStat;
  solution: string[];
  solutionBullets: { label: string; value: string }[];
  impact: string[];
  metrics: Metric[];
  reachBaseline: number;
  links: ProjectLinks;
  buildTimeline: BuildMilestone[];
  toolsUsed: string[];
  lessonsLearned: string[];
  gallery: string[];
  codeSnippet: CodeSnippet;
  quote?: { text: string; attribution: string };
  monthly: number[];
  domainShare: number;
}

export interface ImpactStat {
  label: string;
  value: number;
  unit?: string;
  delta: string;
  description: string;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  short: string;
  body: string;
  side: "left" | "right";
  links?: { label: string; href: string }[];
}

export interface SkillAxis {
  axis: string;
  value: number;
}

export interface Mentor {
  name: string;
  attribution: string;
}

export interface SiteMeta {
  name: string;
  age: number;
  location: string;
  mission: string;
  tagline: string;
  url: string;
  description: string;
  contact: { email: string; github: string; linkedin: string };
}
