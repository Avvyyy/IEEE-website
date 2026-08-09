export interface AdminSection {
  type: string;
  label: string;
  description: string;
  kind: "object" | "array";
}

export const ADMIN_SECTIONS: AdminSection[] = [
  { type: "site", label: "Site Settings", description: "Branch name, tagline, hero images, socials, join link", kind: "object" },
  { type: "stats", label: "Key Stats", description: "Homepage animated counter strip", kind: "array" },
  { type: "pillars", label: "Focus Areas", description: "Technical pillar cards on the homepage", kind: "array" },
  { type: "events", label: "Events", description: "Upcoming and past events", kind: "array" },
  { type: "team", label: "Team", description: "Executives and committee leads", kind: "array" },
  { type: "projects", label: "Projects", description: "Member-built technical projects", kind: "array" },
  { type: "partners", label: "Partners & Sponsors", description: "Logos shown in the partners strip", kind: "array" },
  { type: "news", label: "News & Blog", description: "Latest news / blog cards", kind: "array" },
  { type: "axis", label: "AXIS Congress", description: "Dedicated AXIS Congress page content", kind: "object" },
  { type: "about", label: "About Page", description: "History, mission, vision, advisor, awards", kind: "object" },
];
