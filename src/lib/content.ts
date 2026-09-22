import { promises as fs } from "fs";
import path from "path";
import {
  dbGetEvents,
  dbGetTeamMembers,
  dbGetTeamSessions,
  dbGetNews,
  dbGetPartners,
  dbGetAxisCongress,
  dbGetAxisIgnite,
  dbGetOpportunities,
  dbGetPrograms,
  dbGetSubcommittees,
  dbGetCommitteeMembers,
  computeStatus,
  type DbEvent,
  type DbTeamMember,
  type DbNews,
  type DbPartner,
  type DbOpportunity,
} from "./db";
import type {
  AboutContent,
  AxisContent,
  ContactSubmission,
  EventItem,
  NewsItem,
  NewsletterSignup,
  Partner,
  Pillar,
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
  about: "about.json",
};

export const getSiteConfig = () => readJson<SiteConfig>(FILE_MAP.site);
export const getStats = () => readJson<StatItem[]>(FILE_MAP.stats);
export const getPillars = () => readJson<Pillar[]>(FILE_MAP.pillars);
export const getAbout = () => readJson<AboutContent>(FILE_MAP.about);

export async function getRawContent(type: string): Promise<unknown> {
  const file = FILE_MAP[type];
  if (file) return readJson(file);

  // For Supabase-backed types, fetch and return
  switch (type) {
    case "events":
      return getEventsFromDb();
    case "team":
      return getTeamFromDb();
    case "news":
      return getNewsFromDb();
    case "partners":
      return getPartnersFromDb();
    case "axis":
      return getAxisFromDb();
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}

export async function saveRawContent(type: string, data: unknown): Promise<void> {
  const file = FILE_MAP[type];
  if (!file) throw new Error(`Content type "${type}" is stored in Supabase and cannot be saved to disk.`);
  await writeJson(file, data);
}

// ─── Supabase-backed getters ─────────────────────────────────────────────

function dbEventToItem(e: DbEvent): EventItem {
  return {
    id: e.id,
    title: e.title,
    date: e.start_date,
    endDate: e.end_date ?? undefined,
    location: e.location ?? "",
    description: e.description ?? "",
    image: e.image_url ?? "",
    registrationUrl: e.registration_url ?? undefined,
    vtoolsUrl: e.vtools_url ?? undefined,
    featured: e.featured,
    status: computeStatus(e),
  };
}

function dbTeamToItem(m: DbTeamMember): TeamMember {
  return {
    id: m.id,
    name: m.name,
    role: m.title,
    category: "Executive",
    photo: m.image_url ?? "",
    bio: m.bio ?? "",
    linkedin: m.linkedin ?? undefined,
    session: m.session,
  };
}

function dbNewsToItem(n: DbNews): NewsItem {
  return {
    id: n.id,
    title: n.title,
    excerpt: n.description ?? "",
    date: n.published_at ?? n.created_at,
    url: "#",
    image: n.image_url ?? "",
  };
}

function dbPartnerToItem(p: DbPartner): Partner {
  return {
    id: p.id,
    name: p.name,
    logo: p.logo_url ?? "",
    url: p.website_url ?? undefined,
  };
}

export async function getEventsFromDb(): Promise<EventItem[]> {
  try {
    const events = await dbGetEvents();
    return events.map(dbEventToItem);
  } catch {
    return [];
  }
}

export async function getTeamFromDb(session?: string): Promise<TeamMember[]> {
  try {
    const members = await dbGetTeamMembers(session);
    return members.map(dbTeamToItem);
  } catch {
    return [];
  }
}

export async function getTeamSessionsFromDb(): Promise<string[]> {
  try {
    return await dbGetTeamSessions();
  } catch {
    return [];
  }
}

export async function getNewsFromDb(): Promise<NewsItem[]> {
  try {
    const items = await dbGetNews();
    return items.map(dbNewsToItem);
  } catch {
    return [];
  }
}

export async function getPartnersFromDb(): Promise<Partner[]> {
  try {
    const partners = await dbGetPartners();
    return partners.map(dbPartnerToItem);
  } catch {
    return [];
  }
}

// ─── Alias exports matching what public pages import ─────────────────────
export const getEvents = getEventsFromDb;
export const getTeam = getTeamFromDb;
export const getNews = getNewsFromDb;
export const getPartners = getPartnersFromDb;
export const getAxis = getAxisFromDb;

export async function getAxisFromDb(): Promise<AxisContent> {
  try {
    const congress = await dbGetAxisCongress();
    const igniteItems = congress
      ? await dbGetAxisIgnite(congress.id)
      : [];

    return {
      theme: congress?.theme ?? "",
      date: congress?.event_date ?? "",
      endDate: congress?.end_date ?? undefined,
      venue: congress?.location ?? "",
      description: congress?.description ?? "",
      bannerImage: congress?.banner_url ?? "",
      flierUrl: congress?.flier_url ?? undefined,
      registrationUrl: congress?.registration_url ?? "",
      days: (congress?.days ?? []).map((d, i) => ({
        label: d.label ?? `Day ${i + 1}`,
        date: d.date ?? "",
        time: d.time ?? "",
        venue: d.venue ?? "",
      })),
      ignite: {
        title: "AXIS Ignite",
        tagline: "Weekly technical webinars",
        description: "",
        bannerImage: "",
        webinars: igniteItems.map((w) => ({
          id: w.id,
          week: w.week_number ?? 0,
          title: w.title,
          date: w.event_date ?? "",
          time: w.event_time ?? "",
          speaker: w.speaker ?? "",
          speakerTitle: w.speaker_title ?? "",
          speakerBio: w.speaker_bio ?? undefined,
          speakerImage: w.speaker_image_url ?? undefined,
          description: w.description ?? "",
        })),
      },
      speakers: [],
      schedule: [],
      sponsors: [],
      gallery: [],
    };
  } catch {
    return {
      theme: "",
      date: "",
      venue: "",
      description: "",
      bannerImage: "",
      registrationUrl: "",
      days: [],
      ignite: {
        title: "AXIS Ignite",
        tagline: "",
        description: "",
        bannerImage: "",
        webinars: [],
      },
      speakers: [],
      schedule: [],
      sponsors: [],
      gallery: [],
    };
  }
}

export async function getOpportunitiesFromDb(): Promise<DbOpportunity[]> {
  try {
    return await dbGetOpportunities();
  } catch {
    return [];
  }
}

export async function getCommitteeData() {
  try {
    const programs = await dbGetPrograms();
    const subcommittees = await dbGetSubcommittees();
    const members = await dbGetCommitteeMembers();
    return { programs, subcommittees, members };
  } catch {
    return { programs: [], subcommittees: [], members: [] };
  }
}

// ─── Legacy JSON-based getters (kept for backward compat) ────────────────

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
