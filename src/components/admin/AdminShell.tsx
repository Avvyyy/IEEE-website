"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Mail, MessageSquare } from "lucide-react";
import { ADMIN_SECTIONS } from "@/lib/admin-sections";
import { cn } from "@/lib/utils";

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
          src="/images/logo-ieee-babcock.svg"
          alt="IEEE Babcock SB"
          width={160}
          height={40}
          className="h-8 w-auto mb-8 mx-2"
        />
        <nav className="flex-1 space-y-1">
          <NavItem href="/admin" icon={<LayoutDashboard size={16} />} active={pathname === "/admin"}>
            Dashboard
          </NavItem>
          <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wider text-body/60">Content</p>
          {ADMIN_SECTIONS.map((section) => (
            <NavItem
              key={section.type}
              href={`/admin/content/${section.type}`}
              active={pathname === `/admin/content/${section.type}`}
            >
              {section.label}
            </NavItem>
          ))}
          <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wider text-body/60">Inbox</p>
          <NavItem href="/admin/submissions" icon={<MessageSquare size={16} />} active={pathname === "/admin/submissions"}>
            Contact Submissions
          </NavItem>
          <NavItem href="/admin/newsletter" icon={<Mail size={16} />} active={pathname === "/admin/newsletter"}>
            Newsletter Signups
          </NavItem>
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
        active ? "bg-ieee-blue/20 text-white" : "text-body hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
