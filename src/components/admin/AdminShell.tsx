"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Calendar,
  Users,
  Newspaper,
  Radio,
  Handshake,
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/axis", label: "AXIS Congress", icon: Radio },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
];

const CONTENT_ITEMS = [
  { href: "/admin/content/site", label: "Site Settings", icon: Settings },
  { href: "/admin/content/stats", label: "Key Stats", icon: FileText },
  { href: "/admin/content/pillars", label: "Focus Areas", icon: FileText },
  { href: "/admin/content/about", label: "About Page", icon: FileText },
];

const INBOX_ITEMS = [
  { href: "/admin/submissions", label: "Contact Submissions", icon: MessageSquare },
  { href: "/admin/newsletter", label: "Newsletter Signups", icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-surface/40 p-4">
        <Image
          src="/images/logo-ieee-babcock.png"
          alt="IEEE Babcock SB"
          width={160}
          height={40}
          className="h-8 w-auto mb-8 mx-2"
        />
        <nav className="flex-1 space-y-1 overflow-y-auto">
          <NavItem
            href="/admin"
            icon={<LayoutDashboard size={16} />}
            active={pathname === "/admin"}
          >
            Dashboard
          </NavItem>

          <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wider text-body/60">
            Content Management
          </p>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon size={16} />}
              active={pathname === item.href}
            >
              {item.label}
            </NavItem>
          ))}

          <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wider text-body/60">
            Site Content
          </p>
          {CONTENT_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon size={16} />}
              active={pathname === item.href}
            >
              {item.label}
            </NavItem>
          ))}

          <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wider text-body/60">
            Inbox
          </p>
          {INBOX_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon size={16} />}
              active={pathname === item.href}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-body hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between border-b border-white/10 px-4 py-3">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          <button onClick={logout} className="text-sm text-body hover:text-white">
            Log Out
          </button>
        </header>
        <main className="p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  children,
  active,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-ieee-blue/20 text-white"
          : "text-body hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
