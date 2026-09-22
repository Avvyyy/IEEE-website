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
  { type: "about", label: "About Page", description: "History, mission, vision, advisor, awards", kind: "object" },
];

export const CRUD_SECTIONS = [
  { href: "/admin/events", label: "Events", description: "Upcoming and past events" },
  { href: "/admin/team", label: "Team", description: "Core team and committee members" },
  { href: "/admin/news", label: "News & Highlights", description: "Blog posts and announcements" },
  { href: "/admin/axis", label: "AXIS Congress", description: "Congress details and Ignite webinars" },
  { href: "/admin/partners", label: "Partners & Sponsors", description: "Partner and sponsor logos" },
  { href: "/admin/opportunities", label: "Opportunities", description: "Internships, competitions, research" },
];
