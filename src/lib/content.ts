import { promises as fs } from "fs";
import path from "path";
import type {
  AboutContent,
  AxisContent,
  ContactSubmission,
  EventItem,
  NewsItem,
  NewsletterSignup,
  Partner,
  Pillar,
  Project,
  SiteConfig,
  StatItem,
  TeamMember,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readJson<T>(file: string): Promise<T> {
  const filePath = path.join(CONTENT_DIR, file);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  const filePath = path.join(CONTENT_DIR, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export const FILE_MAP: Record<string, string> = {
  site: "site.json",
  stats: "stats.json",
  pillars: "pillars.json",
  events: "events.json",
  team: "team.json",
  projects: "projects.json",
  partners: "partners.json",
  news: "news.json",
  axis: "axis.json",
  about: "about.json",
};

export const getSiteConfig = () => readJson<SiteConfig>(FILE_MAP.site);
export const getStats = () => readJson<StatItem[]>(FILE_MAP.stats);
export const getPillars = () => readJson<Pillar[]>(FILE_MAP.pillars);
export const getEvents = () => readJson<EventItem[]>(FILE_MAP.events);
export const getTeam = () => readJson<TeamMember[]>(FILE_MAP.team);
export const getProjects = () => readJson<Project[]>(FILE_MAP.projects);
export const getPartners = () => readJson<Partner[]>(FILE_MAP.partners);
export const getNews = () => readJson<NewsItem[]>(FILE_MAP.news);
export const getAxis = () => readJson<AxisContent>(FILE_MAP.axis);
export const getAbout = () => readJson<AboutContent>(FILE_MAP.about);

export async function getRawContent(type: string): Promise<unknown> {
  const file = FILE_MAP[type];
  if (!file) throw new Error(`Unknown content type: ${type}`);
  return readJson(file);
}

export async function saveRawContent(type: string, data: unknown): Promise<void> {
  const file = FILE_MAP[type];
  if (!file) throw new Error(`Unknown content type: ${type}`);
  await writeJson(file, data);
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  try {
    return await readJson<ContactSubmission[]>("submissions.json");
  } catch {
    return [];
  }
}

export async function addSubmission(
  submission: Omit<ContactSubmission, "id" | "receivedAt">
): Promise<ContactSubmission> {
  const submissions = await getSubmissions();
  const entry: ContactSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
  };
  submissions.unshift(entry);
  await writeJson("submissions.json", submissions);
  return entry;
}

export async function getNewsletterSignups(): Promise<NewsletterSignup[]> {
  try {
    return await readJson<NewsletterSignup[]>("newsletter.json");
  } catch {
    return [];
  }
}

export async function addNewsletterSignup(email: string): Promise<NewsletterSignup> {
  const signups = await getNewsletterSignups();
  if (signups.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return signups.find((s) => s.email.toLowerCase() === email.toLowerCase())!;
  }
  const entry: NewsletterSignup = {
    id: crypto.randomUUID(),
    email,
    receivedAt: new Date().toISOString(),
  };
  signups.unshift(entry);
  await writeJson("newsletter.json", signups);
  return entry;
}
