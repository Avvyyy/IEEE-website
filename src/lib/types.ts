export interface SiteConfig {
  branchName: string;
  shortName: string;
  tagline: string;
  aboutSnippet: string;
  founded: number;
  region: string;
  email: string;
  location: string;
  joinLink: string;
  socials: {
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  heroImages: string[];
  vtoolsUrl: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  image: string;
  registrationUrl?: string;
  vtoolsUrl?: string;
  featured?: boolean;
  status: "upcoming" | "past";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "Executive" | "Technical" | "Creative" | "Outreach";
  photo: string;
  bio: string;
  linkedin?: string;
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  team: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  url: string;
  image: string;
}

export interface AxisSpeaker {
  id: string;
  name: string;
  title: string;
  photo: string;
}

export interface AxisScheduleItem {
  id: string;
  time: string;
  title: string;
  speaker?: string;
}

export interface AxisContent {
  theme: string;
  date: string;
  venue: string;
  description: string;
  bannerImage: string;
  registrationUrl: string;
  speakers: AxisSpeaker[];
  schedule: AxisScheduleItem[];
  sponsors: Partner[];
  gallery: string[];
}

export interface AboutContent {
  history: string;
  ieeeContext: string;
  mission: string;
  vision: string;
  values: string[];
  advisor: {
    name: string;
    title: string;
    photo: string;
    bio: string;
  };
  awards: { id: string; title: string; year: string; description: string }[];
}

export interface NewsletterSignup {
  id: string;
  email: string;
  receivedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
}

export type ContentType =
  | "site"
  | "stats"
  | "pillars"
  | "events"
  | "team"
  | "projects"
  | "partners"
  | "news"
  | "axis"
  | "about";
